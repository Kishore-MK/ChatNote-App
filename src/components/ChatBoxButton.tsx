import {useState} from "react";
import ChatBox from "./ChatBox";
import { Bot } from "lucide-react";
import { Button } from "./ui/button";

export const ChatBoxButton = () => {
    const [chatBoxopen, setChatBoxOpen]= useState(false);

  return (
    <>
    <Button onClick={()=> setChatBoxOpen(true)}>
        <Bot size={20} className="mr-2"/>
        Ai Chat
    </Button>
    <ChatBox open={chatBoxopen} onClose={()=>setChatBoxOpen(false)}/>
    </>
  )
}
