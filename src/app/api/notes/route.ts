import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import {
  CreatelinkSchema,
  deleteNoteSchema,
  noteSchema,
  updateNoteSchema,
} from "@/lib/validation/note";
import scrapeAndProcessData from "../../../components/linkdata";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const parseResult = noteSchema.safeParse(data);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    var linkdataEmbeddings: number[][] = []

    const { title, content, link } = parseResult.data;
    console.log(link);
  
    const urls = link?.map((url) => `link: ${url}`).join("\n");
    console.log("embed", urls);
    const embedding = await getEmbeddingForNote(title, content, urls ?? "");

    if (link?.length !== 0 && link !== undefined) {
      const data:Promise<any>[] = link?.map((url) => scrapeAndProcessData(url));
      const allCleanedData = await Promise.all(data);
      var combinedText = allCleanedData.join(" ");
      console.log(combinedText);
      const docs = await generateChunks(combinedText);
      console.log(docs);

      var linkdataEmbeddings: number[][] =await getLinkdataEmbeddings(docs);
      console.log(linkdataEmbeddings)
      
    }
    

    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.create({
        data: {
          title,
          content,
          linkdata:combinedText,
          links: {
            create: link?.map((link) => ({
              link: link,
            })),
          },
        },
      });

      await notesIndex.upsert([
        {
          id: note.id,
          values: embedding,
        },
      ]);
      
      linkdataEmbeddings.map(async (linkdata)=>{
        await notesIndex.upsert([
          {
            id: note.id,
            values: linkdata,
          },
        ])
      })
      return note;
    });
    console.log(note);
    return Response.json({ note }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server srror" }, { status: 500 });
  }
}
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    console.log("put", data);
    const parseResult = updateNoteSchema.safeParse(data);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id, title, content } = parseResult.data;
    const link: CreatelinkSchema[] = data.links;
    console.log("put", link);
    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return Response.json({ error: "Note not found." });
    }
    const urls = link.map((link) => `link: ${link.link}`).join("\n");
    console.log("update urls", urls);
    const embedding = await getEmbeddingForNote(title, content, urls);

    // get links before performing updation
    const currentLinks = await prisma.link.findMany({
      where: { noteId: id },
    });

    const linksToDelete = currentLinks.filter(
      (existingLink) =>
        !link.some((check) => check.link === existingLink.link)
    );

    const linksToCreate =
      link?.filter(
        (newLink) =>
          !currentLinks.some(
            (existingLink) => existingLink.link === newLink.link
          )
      ) ?? [];
      var linkdataEmbeddings: number[][] =[]
      

    if (linksToCreate?.length !== 0) {
      const data = linksToCreate?.map((url) => scrapeAndProcessData(url.link));
      const allCleanedData = await Promise.all(data);
      var combinedText = allCleanedData.join(" ");
      console.log(combinedText);
      const docs = await generateChunks(combinedText);
      console.log(docs);

      var linkdataEmbeddings: number[][] =await getLinkdataEmbeddings(docs);
      console.log(linkdataEmbeddings)
      
    }

    const updatednote = await prisma.$transaction(async (tx) => {
      const note = tx.note.update({
        where: {
          id,
        },
        data: {
          title,
          linkdata:combinedText,
          content,
        },
      });
      
      await Promise.all(
        linksToDelete.map(async (link) => {
          await tx.link.delete({
            where: { id: link.id },
          });
        })
      );

      // Create new links
      await Promise.all(
        linksToCreate.map(async (newLink) => {
          await tx.link.create({
            data: {
              link: newLink.link,
              noteId: id,
            },
          });
        })
      );

      await notesIndex.upsert([
        {
          id: id,
          values: embedding,
        },
      ]);
      linkdataEmbeddings.map(async (linkdata)=>{
        await notesIndex.upsert([
          {
            id: id,
            values: linkdata,
          },
        ])
      })
      return note;
    });
    console.log(updatednote);
    return Response.json({ updatednote }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server srror" }, { status: 500 });
  }
}
export async function DELETE(req: Request) {
  try {
    const data = await req.json();
    const parseResult = deleteNoteSchema.safeParse(data);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;
    const note = await prisma.note.findUnique({
      where: { id },
    });
    if (!note) {
      return Response.json({ error: "Note not found." });
    }
    const deletednote = prisma.$transaction(async (tx) => {
      await tx.link.deleteMany({
        where: { noteId: id },
      });

      await tx.note.delete({
        where: { id },
      });

      await notesIndex.deleteMany([id]);
    });

    return Response.json({ message: "Note deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server srror" }, { status: 500 });
  }
}

async function getEmbeddingForNote(
  title: string,
  content: string | undefined,
  links: string
) {
  return getEmbedding(title + "\n\n" + content ?? "" + links + "\n\n");
}

async function generateChunks(text: string) {
  console.log("Generating chunks..");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const output = await splitter.splitText(text);
  // console.log(output);

  return output;
}
const apiKey =process.env.OPENAI_API_KEY
async function getLinkdataEmbeddings(docs:any) {
  console.log("Creating link embeddings..")
  const embeddings = new OpenAIEmbeddings({
    apiKey,
    batchSize: 512, 
    model: "text-embedding-ada-002",
  });
  const vectors = await embeddings.embedDocuments(docs);
console.log(vectors[0].length);

  return vectors

  console.log("Link data vectors stored..")
}
