"use client";
import { CreateNoteSchema, noteSchema } from "@/lib/validation/note";
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), {ssr: false});

import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { LoadingButton } from "./ui/loading-button";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Delete,
  DeleteIcon,
  Plus,
  PlusCircle,
  Trash,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import notemodel from "@/lib/notemodel";
import { headers } from "next/headers";
import ShowLink from "./ui/ShowLink";
interface EditNoteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  edit: boolean;
  setEdit: (edit: boolean) => void;
  NoteToEdit: notemodel;
  setNoteToEdit: (NoteToEdit: notemodel) => void;
}

export default function EditNote({
  open,
  setOpen,
  edit,
  setEdit,
  NoteToEdit,
  setNoteToEdit,
}: EditNoteProps) {
  const [deleteInProgress, SetDeleteInProgress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

 

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      if (NoteToEdit) {
        const response = await fetch("/api/notes", {
          method: "PUT",
          body: JSON.stringify({
            ...NoteToEdit,
          }),
        });
        if (!response.ok) throw Error("Status code: " + response.status);
      }
      router.refresh();
      setEdit(false);
      setIsSubmitting(false);
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }
  async function deleteNote() {
    if (!NoteToEdit) return;
    SetDeleteInProgress(true);
    try {
      const response = await fetch("/api/notes", {
        method: "DELETE",
        body: JSON.stringify({
          id: NoteToEdit.id,
        }),
      });
      if (!response.ok) throw Error("Status code: " + response.status);

      setEdit(false);

      SetDeleteInProgress(false);
    } catch (e) {
      console.error(e);
    } finally {
      router.refresh()
    }
  }

  const handleInputChange = (name: string, value: string) => {
    console.log("chaginig");
    setNoteToEdit({
      ...NoteToEdit,
      [name]: value,
    });
  };
  const handleTitleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    console.log("chaginig");
    setNoteToEdit({
      ...NoteToEdit,
      [name]: value,
    });
  };

  const handleAddLink = () => {
    if (NoteToEdit.links.length <= 3) {
      setNoteToEdit({
        ...NoteToEdit,
        links: [
          ...NoteToEdit.links,
          { id: "", link: null, noteId: NoteToEdit.id },
        ],
      });
    } else {
      console.log("Add maximum of four links!");
    }
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = [...NoteToEdit.links];
    updatedLinks.splice(index, 1);
    setNoteToEdit({
      ...NoteToEdit,
      links: updatedLinks,
    });
  };

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
    <div className="my-1 mx-3 relative ">
      <div className="flex flex-col xl:flex-row gap-[30px] ">
        <div
          className={cn(
            open
              ? "flex flex-col h-[878px] shadow-xl border-[1px] border-gray-200 gap-6 p-10 rounded-xl"
              : "hidden"
          )}
        >
          {edit ? (
            <form onSubmit={handleSubmit}>
              <div className="flex justify-end gap-3 absolute mb-4 right-10">
                <LoadingButton
                  className="rounded-3xl"
                  type="button"
                  loading={false}
                  onClick={() => setEdit(false)}
                >
                  Cancel
                </LoadingButton>
                <LoadingButton
                  className="rounded-3xl"
                  type="submit"
                  loading={false}
                >
                  Save
                </LoadingButton>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                <label className="text-2xl">Title</label>
                <Input
                  className="mt-2"
                  type="text"
                  name="title"
                  value={NoteToEdit.title}
                  onChange={handleTitleChange}
                />
                <br />
                <label className="text-2xl">Content</label>
                <ReactQuill
                  className="h-[300px] w-[650px]"
                  theme="snow"
                  value={NoteToEdit.content || ""}
                  modules={modules}
                  onChange={(value) => handleInputChange("content", value)}
                />
                {/* <Textarea
                className="h-[200px] w-[650px]"
                name="content"
                value={NoteToEdit.content || ""}
                onChange={handleInputChange}
              /> */}
                <br />
                <label className="w-20">
                  <Button
                    className="text-2xl font-normal p-0 border-none hover:bg-background-none active:text-gray-500 "
                    variant="outline"
                    type="button"
                    onClick={handleAddLink}
                  >
                    Add link
                    <PlusCircle className="ml-2 rounded-full hover:bg-gray-200" />
                  </Button>
                </label>

                {NoteToEdit.links.map((link, index) => (
                  <div className="flex " key={index}>
                    <Input
                      className="w-full"
                      type="text"
                      value={link.link || ""}
                      onChange={(event) => {
                        const updatedLinks = [...NoteToEdit.links];
                        updatedLinks[index].link = event.target.value;
                        setNoteToEdit({
                          ...NoteToEdit,
                          links: updatedLinks,
                        });
                      }}
                    />
                    <Button
                      className=" ml-1 p-2 border-none rounded-full hover:bg-gray-300 "
                      variant="outline"
                      onClick={() => handleRemoveLink(index)}
                      type="button"
                    >
                      <XCircle className="" />
                    </Button>
                  </div>
                ))}
              </div>
            </form>
          ) : (
            //   view page
            <form>
              <div className="flex justify-end gap-3 top-[18px] absolute right-10">
                {NoteToEdit && (
                  <LoadingButton
                    className="rounded-3xl"
                    variant="destructive"
                    loading={deleteInProgress}
                    onClick={deleteNote}
                    type="button"
                  >
                    <Trash />
                  </LoadingButton>
                )}
                <Button
                  className="rounded-3xl"
                  type="button"
                  onClick={() => setEdit(true)}
                >
                  Edit
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                <label className="text-2xl">Title</label>
                <div className="flex items-center p-3 justify-center rounded-lg bg-slate-100">
                  <p className="md:w-[650px] pl-[10px] text-lg">{NoteToEdit.title}</p>
                </div>
                <br />
                <label className="text-2xl">Content</label>
                <ReactQuill
                  className="h-[300px] md:w-[650px] sm:w-[200px]"
                  theme="snow"
                  value={NoteToEdit.content || ""}
                  modules={modules}
                  readOnly
                />
                {/* <Textarea
              className="h-[200px] w-[650px]"
              name="content"
              value={NoteToEdit.content || ""}
              onChange={handleInputChange}
            /> */}
                <br />
                <label className="w-20">
                  <Button
                    className="text-2xl font-normal p-0 border-none hover:bg-background-none active:text-gray-500 "
                    variant="outline"
                    type="button"
                  >
                    Links
                  </Button>
                </label>

                {NoteToEdit.links.map((link, index) => (
                  <div className="flex items-center p-3 justify-center rounded-lg bg-slate-100" key={index}>
                    {/* <p>{link.link || ""}</p> */}
                    <ShowLink value={link.link || ""} />
                  </div>
                ))}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
