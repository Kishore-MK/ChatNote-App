"use client";
import { ChatBoxButton } from "./ChatBoxButton";
import ThemeToggle from "./ThemeToggle";
import AddNoteDialog from "./ui/AddNoteDialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function NavBar(){
    const [showAddNoteDialog,setShowAddNoteDialog]=useState(false);


    return(
        <div className="flex justify-center mt-1">
            <div className="w-full mx-3 p-4 shadow-md rounded-xl">
                <div className="flex gap-3 items-center ">
                    <span className="space-x-2">Chat Note</span>
                    <div className="space-x-3 xl:ml-[1400px] md:ml-[470px]">
                    <ThemeToggle/>
                    <Button onClick={()=>setShowAddNoteDialog(true)}>
                        <Plus size={20} className="mr-2"/>
                        Add Note
                    </Button>
                    <ChatBoxButton/>
                    </div>
                </div>
            </div>
            <div>
                <AddNoteDialog open={showAddNoteDialog} setOpen={setShowAddNoteDialog}/>
            </div>
        </div>
    )
}