"use client";
import { ScrollArea } from "./scroll-area";
import { Note } from "./Note";
import EditNote from "../EditNote";
import { useState } from "react";
import notemodel from "@/lib/notemodel";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "./select";
import { PlusCircle } from "lucide-react";

interface allnotesprops{
  allnotes: notemodel[];
}

const ViewNote = ({ allnotes }:allnotesprops) => {
  {
    
    const [edit, setEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const [notetoedit, setNoteToEdit] = useState<notemodel>();
    return (
      <div className="flex mr-7 mt-[5px]">
        {allnotes.length !== 0 ? (
          <div>
            <ScrollArea className="my-1 ml-2 h-[880px] w-[400px] rounded-xl border shadow-md">
              {/* <Select >
                <SelectTrigger className="w-[385px] ml-[6px] my-2 rounded-xl">
                  <SelectValue placeholder="Today"  />
                </SelectTrigger>
                <SelectContent className=" p-0 m-0 w-[385px]"> */}
                  <div className="pl-[15px]">
                    {allnotes.map((note) => {
                      const date = new Date();
                      
                        
                      
                      return (
                        
                        note.createdAt.getDate()===date.getDate() ? 
                      <Note
                        note={note}
                        open={open}
                        setOpen={setOpen}
                        setEditNote={setNoteToEdit}
                        key={note.id}
                      />
                      :
                      " "
                     
                    )
                    })}
                  </div>
                {/* </SelectContent>
              </Select> */}
            </ScrollArea>
          </div>
        ) : (
          <div className="ml-[800px] justify-center">
            <div className="flex">
              <p className="flex mt-[340px] text-2xl">
                
                Click here to create a new note<PlusCircle className="mt-1 ml-2"/>
              </p>
              <div className="rotate-12 mt-[30px] ml-[50px]">
                <Image
                  className=""
                  width={380}
                  height={50}
                  alt="arrow"
                  src="/arrow.png"
                />
              </div>
            </div>
          </div>
        )}
        <div>
          {notetoedit ? (
            <EditNote
              open={open}
              setOpen={setOpen}
              edit={edit}
              setEdit={setEdit}
              NoteToEdit={notetoedit}
              setNoteToEdit={setNoteToEdit}
            />
          ) : (
            " "
          )}
        </div>
      </div>
    );
  }
};

export default ViewNote;
