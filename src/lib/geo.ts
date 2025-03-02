import {type Link, type Node} from './models/element.model';

export function getNodesMap(nodes: Node[], links: Link[]): Map<string, Node[]> {
    return nodes.map(node => node.id)
        .reduce((map, id) => map.set(id, links.filter(link => link.from === id).map(link => findFirstNode(nodes, link.to))), new Map<string, Node[]>());
}

export function findFirstNode(nodes: Node[], id: string): Node {
    return nodes.find(node => node.id.toLowerCase().includes(id.toLowerCase()))!;
}

export function getNewNodePosition(node: Node) {
    return { x: node.x + 50, y: node.y + 50 };
}