import { writable } from 'svelte/store';
import {type Node} from "$lib/models/element.model.js";

function createMindMapStore() {
    const nodesMap = writable<Map<string, Node>>(new Map());

    let node1 : Node = {
        id: crypto.randomUUID(),
        x: 500,
        y: 250,
        label: '1',
        parent: null,
        children: []
    };
    let node2 : Node = {
        id: crypto.randomUUID(),
        x: 550,
        y: 300,
        label: '2',
        parent: node1,
        children: []
    };
    let node3 : Node = {
        id: crypto.randomUUID(),
        x: 600,
        y: 350,
        label: '3',
        parent: node2,
        children: []
    };
    node1.children.push(node2.id);
    node2.children.push(node3.id);

    nodesMap.update((nodesMap) => {
        nodesMap.set(node1.id, node1);
        nodesMap.set(node2.id, node2);
        nodesMap.set(node3.id, node3);
        return nodesMap;
    });

    return {
        nodes: nodesMap,

        addNode: (label: string, x: number, y: number, parent: Node | null = null) : Node => {
            let node = { id: crypto.randomUUID(), x, y, label, parent: parent, children: [] };
            nodesMap.update((nodesMap) => {
                nodesMap.set(node.id, node);
                if (parent) {
                    parent.children.push(node.id);
                    nodesMap.set(parent.id, parent);
                }
                return nodesMap;
            });
            return node;
        },

        updateNodePosition: (id: string, x: number, y: number) => {
            nodesMap.update((nodesMap) =>
                nodesMap.set(id, { ...nodesMap.get(id)!, x, y })
            );
        },

        updateNodeLabel: (id: string, label: string) => {
            nodesMap.update((nodesMap) =>
                nodesMap.set(id, { ...nodesMap.get(id)!, label })
            );
        },

        removeNode: (id: string) => {
            nodesMap.update((nodesMap) => {
                nodesMap.delete(id);
                return nodesMap;
            });
        },
    };
}

export const mindMap = createMindMapStore();