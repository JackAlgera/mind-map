import { writable } from 'svelte/store';
import {type Node} from "$lib/models/element.model.js";

function createMindMapStore() {
    const nodesMap = writable<Map<string, Node>>(new Map());

    let node1: Node = {
        id: crypto.randomUUID(),
        x: 500,
        y: 250,
        label: '1',
        parent: null,
        children: []
    };
    let node2: Node = {
        id: crypto.randomUUID(),
        x: 550,
        y: 300,
        label: '2',
        parent: node1,
        children: []
    };
    let node3: Node = {
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

    const fetchBranchNodes = (root: Node, nodes: Set<Node>, nodesMap: Map<string, Node>): Set<Node> => {
        nodes.add(root);

        if (!root.children || root.children.length === 0) {
            return nodes;
        }

        root.children.forEach((childId) => {
            let child = nodesMap.get(childId);
            if (child) {
                fetchBranchNodes(child, nodes, nodesMap);
            }
        });

        return nodes;
    }

    return {
        nodes: nodesMap,

        addNode: (label: string, x: number, y: number, parent: string | null = null) => {
            nodesMap.update((nodesMap) => {
                let parentNode = parent ? nodesMap.get(parent) ?? null : null;
                let newNode: Node = { id: crypto.randomUUID(), x, y, label, parent: parentNode, children: [] };
                nodesMap.set(newNode.id, newNode);
                if (parentNode) {
                    parentNode.children.push(newNode.id);
                    nodesMap.set(parentNode.id, parentNode);
                }
                return nodesMap;
            });
        },

        updateNodePosition: (id: string, dx: number, dy: number) => {
            nodesMap.update((nodesMap) => {
                fetchBranchNodes(nodesMap.get(id)!, new Set<Node>(), nodesMap)
                    .forEach((node: Node) => nodesMap.set(node.id, { ...node, x: node.x + dx, y: node.y + dy }));
                return nodesMap;
            });
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