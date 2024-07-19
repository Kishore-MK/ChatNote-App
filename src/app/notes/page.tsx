import ViewNote from "@/components/ui/ViewNote";
import prisma from "@/lib/db/prisma"

async function getAllNotes() {
      const allNotes = await prisma.note.findMany({
        include: {links: true},
      });
      return (
        <ViewNote allnotes={allNotes}/>
      )
  }
  
export default getAllNotes


