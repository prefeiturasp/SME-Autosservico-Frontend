export type WorkItem = {
    id: number;
    title: string;
    state?: string;
    work_item_type?: string;
};

export type BacklogResponse = {
    parents: WorkItem[];
    children: WorkItem[];
};
