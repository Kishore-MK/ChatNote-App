"use client";
import { CreateNoteSchema, noteSchema } from "@/lib/validation/note";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { LoadingButton } from "./loading-button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./button";
import { Link, XCircle } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import notemodel from "@/lib/notemodel";

interface AddNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit?: notemodel;
}

export default function AddNoteDialog({
  open,
  setOpen,
  noteToEdit,
}: AddNoteDialogProps) {
  const [inputFields, setInputFields] = useState<string[]>([]);
  const [isSubmitting,setIsSubmitting] = useState(false)
  const [deleteInProgress, SetDeleteInProgress] = useState(false);
  const router = useRouter();
  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: noteToEdit?.title || "",
      content: noteToEdit?.content || "",
    },
  });

  const addInputField = () => {
    setInputFields([...inputFields, ""]);
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedFields = [...inputFields];
    updatedFields[index] = value;
    console.log(updatedFields);
    setInputFields(updatedFields);
  };

  const removeInputField = (index: number) => {
    const updatedFields = [...inputFields];
    updatedFields.splice(index, 1);
    setInputFields(updatedFields);
  };

  async function onSubmit(input: CreateNoteSchema) {
    setIsSubmitting(true)
    try {
      
        const response = await fetch("/api/notes", {
          method: "POST",
          body: JSON.stringify({ ...input, link: inputFields }),
        });
        if (!response.ok) throw Error("Status code: " + response.status);
        setInputFields([]);
        form.reset();
      
      router.refresh();
      setIsSubmitting(false)
      setOpen(false);
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again.");
    }
  }
  
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
    ],
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent>
      
        <DialogHeader>
          
          <div className="flex relative">
            
          <DialogTitle className="text-lg">{noteToEdit ? "Edit Note " : "Add Note"}</DialogTitle>
          
              </div>
        </DialogHeader>
        <Form {...form}>
        
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <LoadingButton
          className="h-[35px] absolute right-14 mt-[8px] top-1 rounded-lg"
                type="submit"
                loading={isSubmitting}
                
              >
                Save
              </LoadingButton>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Note title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Content</FormLabel>
                  <FormControl>
                    <ReactQuill
                      className="text-lg h-[300px] w-[650px]"
                      placeholder="Notes"
                      theme="snow"
                      {...field}
                      modules={modules}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>
                      <Button
                        className="p-0 mt-10 text-lg border-none hover:bg-background-none"
                        variant="outline"
                        type="button"
                        onClick={addInputField}
                      >
                        Add link
                        <Link className="ml-2 h-4 w-4"/>
                      </Button>
                    </FormLabel>

                    {inputFields.map((link, index) => (
                      <FormControl key={index}>
                        <div className="flex">
                            
                            <Input placeholder="Add Links" value={link} onChange={(e) => handleInputChange(index, e.target.value)}/>
                            <Button
                              className=" ml-1 p-2 border-none rounded-full "
                              variant="outline"
                              onClick={() => removeInputField(index)}
                            >
                              <XCircle />
                            </Button>
                          </div>
                      </FormControl>
                    ))}
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
