import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { YoutubeTranscript } from "youtube-transcript";
import FirecrawlApp from "@mendable/firecrawl-js";

const apiKey = process.env.FIRECRAWL_API_KEY;
const app = new FirecrawlApp({ apiKey });

async function scrapeAndProcessData(url: string) {
  
  if (url.includes("www.youtube.com")) {

    console.log("fetching youtube..", url);

    const data = await YoutubeTranscript.fetchTranscript(url);
    const text = data.map((ts) => ts.text).join(" ");

    const combinedtext:string = text
      .replace(/[|]/g, "")
      .replace(/[=]/g, "")
      .replace(/[*-]/g, "")
      .replace(/\[.*?\]\(.*?\)/g, "")
      .replace(/\*\*.*?\*\*/g, "")
      .replace(/\*.*?\*/g, "")
      .replace(/#+\s?/g, "")
      .replace(/\s{2,}/g, " ")
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line)
      .join(" ");

      return combinedtext
  } else {

    console.log("fetching..", url);
    
    const scrapedData = await app.scrapeUrl(url);
    const text = await scrapedData.data.content
      .replace(/[|]/g, "")
      .replace(/[=]/g, "")
      .replace(/[*-]/g, "")
      .replace(/\[.*?\]\(.*?\)/g, "")
      .replace(/\*\*.*?\*\*/g, "")
      .replace(/\*.*?\*/g, "")
      .replace(/#+\s?/g, "")
      .replace(/\s{2,}/g, " ")
      .trim()
      .split("\n")
      .map((line:any) => line.trim())
      .filter((line:any) => line)
      .join(" ");

      return text;
  }

  // getEmbeddings(text);
  
}


export default scrapeAndProcessData;
