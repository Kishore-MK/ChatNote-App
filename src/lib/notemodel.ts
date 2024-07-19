type notemodel = {
    id: string;
    title: string;
    content: string | null;
    linkdata: string | null;
    createdAt: Date;
    updatedAt: Date;
}& {
    links: {
        id: string;
        link: string | null;
        noteId: string;
    }[];
}

export default notemodel