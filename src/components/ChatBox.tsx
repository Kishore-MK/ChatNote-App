import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { Trash, XCircle } from "lucide-react";
import { Message } from "ai";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useRef } from "react";
import { Separator } from "./ui/separator";

interface ChatBoxProps {
  open: boolean;
  onClose: () => void;
}
export default function ChatBox({ open, onClose }: ChatBoxProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat();

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if(scrollRef.current){
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  },[messages])

  useEffect(()=>{
    if(open){
        inputRef.current?.focus();
    }
  },[open])
  const lastMessageIsUser = messages[messages.length -1]?.role==="user";

  return (
    <div
      className={cn(
        "right-0 z-10 bottom-7 h-[865px] lg:w-full max-w-[720px] p-1 sm:w-[250px] md:w-[555px]",
        open ? "absolute" : "hidden"
      )}
    >
      
      <div className="flex h-[880px] mt-[5px] mr-2 flex-col rounded-xl bg-background border shadow-xl">
        <div className="flex ">
        <h1 className="p-3">Chat Bot</h1>
     
        <Button onClick={onClose} className="mt-2 ms-auto mr-3 rounded-3xl block">Close</Button>
      
      </div>
      <Separator className="my-2"/>
        <div className="h-full mt-3 px-3 overflow-y-auto " ref={scrollRef}>
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}
          {isLoading && lastMessageIsUser && (
            <ChatMessage message={{
                role:"assistant",
                content: "Thinking..."
            }}/>
          )}
          {error && (
            <ChatMessage message={{
                role: "assistant",
                content: "Something went wrong! Please try again."
            }}/>
          )}
          {!error && messages.length === 0 && (
            
                <ChatMessage message={{
                role: "assistant",
                content: "Ask me anything about your notes!"
            }}/>
            
          )}
        </div>
        <form onSubmit={handleSubmit} className="m-3 flex gap-2">
            <Button
            title="clear chat"
            variant="outline"
            size="icon"
            className="shrink-0 rounded-full"
            type="button"
            onClick={()=> setMessages([])}
            >
                <Trash/>
            </Button>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask something.."
            ref={inputRef}
          />
          <Button className="rounded-3xl" type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}

function ChatMessage({ message: { role, content } }: { message: Pick<Message, "role" | "content"> }) {
    const user = "user";
    const isAiMessage = role === "assistant";
    
  return (
    <div className={cn("mb-3 flex items-center", isAiMessage ? "justify-start me-5": "justify-end ms-5")}>
      
      <p className={cn("whitespace-pre-line rounded-lg border px-3 py-2", isAiMessage ? " bg-background ": "bg-primary text-primary-foreground")}>{content}</p>
      </div>
    
  );
}
