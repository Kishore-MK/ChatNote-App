"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { useState } from "react";
import AddNoteDialog from "./AddNoteDialog";
import EditNote from "../EditNote";
import notemodel from "@/lib/notemodel";


interface NoteProps {
  note: notemodel;
  open: boolean;
  setOpen: (edit: boolean) => void;
  setEditNote:(editnote: notemodel) => void;
}

export const Note = ({ note, open, setOpen,setEditNote }: NoteProps) => {
  const wasUpdated = note.updatedAt > note.createdAt;
  
  const Timestamp = (
    wasUpdated ? note.updatedAt : note.createdAt
  ).toDateString();
  const handleClick=()=>{
    setOpen(true)
      setEditNote(note);
  }
  return (
   <>
    <Card className="w-[370px] my-3 cursor-pointer transition-all  hover:bg-gray-100 hover:shadow-lg "
    onClick={handleClick}>
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
        <CardDescription>{Timestamp}</CardDescription>
        
      </CardHeader>
      
    </Card>
    
    </> 
  );
};
