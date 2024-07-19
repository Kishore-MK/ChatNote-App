

import z from "zod";

export const linkSchema = z.object({
    link : z.string(),
    noteId : z.string()
})

export const noteSchema = z.object({
    title: z.string().min(1,{message: "Title Required"}),
    content : z.string().optional(),
    link: z.array(z.string()).optional(),
})

export type CreateNoteSchema= z.infer<typeof noteSchema>
export type CreatelinkSchema= z.infer<typeof linkSchema>

export const updateNoteSchema = noteSchema.extend({
    id: z.string().min(1)
})
export const deleteNoteSchema = z.object({
    id: z.string().min(1)
})