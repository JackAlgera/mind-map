export type Node = {
    id: string;
    x: number;
    y: number;
    label: string;
    parent: Node | null;
    children: string[];
}

export type Link = {
    from: string;
    to: string;
};