
import { Note } from "@/components/ui/Note"
import { ScrollArea } from "@/components/ui/scroll-area"
import prisma from "@/lib/db/prisma"

async function Notespage(){
  {
    const allnotes = await prisma.note.findMany();
    
    

    return (
      <div>
      FUck you
  </div>
  
    )
  }
}

export default Notespage


