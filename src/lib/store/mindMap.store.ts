import { writable } from 'svelte/store';
import {type Link, type Node} from "$lib/models/element.model.js";

function createMindMapStore() {
    const nodes = writable<Node[]>([]);
    const links = writable<Link[]>([]);

    nodes.update((nodes) => [
        ...nodes,
        { id: crypto.randomUUID(), x: 500, y: 250, label: '1' },
    ]);

    return {
        nodes,
        links,

        addNode: (label: string, x: number, y: number) : Node => {
            let node = { id: crypto.randomUUID(), x, y, label };
            nodes.update((nodes) => [
                ...nodes,
                node
            ]);
            return node;
        },

        updateNodePosition: (id: string, x: number, y: number) => {
            nodes.update((nodes) =>
                nodes.map(node => node.id === id ? { ...node, x, y } : node)
            );
        },

        updateNodeLabel: (id: string, label: string) => {
            nodes.update((nodes) =>
                nodes.map(node => node.id === id ? { ...node, label: label } : node)
            );
        },

        removeNode: (id: string) => {
            nodes.update((nodes) => nodes.filter(node => node.id !== id));
            links.update((links) => links.filter(link => link.from !== id && link.to !== id));
        },

        addLink: (from: string, to: string) => {
            links.update((links) => [...links, { from, to }]);
        },
    };
}

export const mindMap = createMindMapStore();