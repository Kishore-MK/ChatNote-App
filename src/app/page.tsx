
import { Note } from "@/components/ui/Note"
import { ScrollArea } from "@/components/ui/scroll-area"
import prisma from "@/lib/db/prisma"

async function Notespage(){
  {
    const allnotes = await prisma.note.findMany();
    
    

    return (
      <div>
      <h1>use /notes in your url</h1>
  </div>
  
    )
  }
}

export default Notespage


