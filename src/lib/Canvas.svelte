<script lang="ts">
  import { mindMap } from "$lib/store/mindMap.store";
  import {type Link, type Node} from "$lib/models/element.model.js";

  let dragging = false;
  let selectedNode : Node | null = null;
  let nodes : Node[];
  let links : Link[];

  mindMap.nodes.subscribe((storedNodes: Node[]) => nodes = storedNodes);
  mindMap.links.subscribe((storedLinks: Link[]) => links = storedLinks);

  function onNodeClick(event: MouseEvent, element: Node) {
      event.stopPropagation();
      selectedNode = element;
      dragging = true;
  }

  function moveNode(event: MouseEvent) {
      if (dragging && selectedNode) {
          mindMap.updateNodePosition(selectedNode.id, event.offsetX, event.offsetY);
      }
  }

  function onMouseUp() {
      dragging = false;
  }

  function findFirstNode(nodes: Node[], id: string): Node {
      return nodes.find(node => node.id.toLowerCase().includes(id.toLowerCase()))!;
  }

  function addNode(label: string, x: number, y: number) {
      if (selectedNode) {
          let newNode = mindMap.addNode(label, x, y);
          mindMap.addLink(selectedNode.id, newNode.id);
      }
  }
</script>

<style>
  .canvas {
      background-color: white;
  }
</style>


<div>
  <button onclick={() => addNode("" + (nodes.length + 1), 100, 100)}>Add node</button>
</div>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<svg width="1000px" height="600px" class="canvas" onmousemove={moveNode} onmouseup={onMouseUp} onmousedown={() => selectedNode = null} >
  {#each links as link}
    <line
        x1={findFirstNode(nodes, link.from).x} y1={findFirstNode(nodes, link.from).y}
        x2={findFirstNode(nodes, link.to).x} y2={findFirstNode(nodes, link.to).y}
        stroke="black" stroke-width="2"
    />
  {/each}
  {#each nodes as node}
    {#if (selectedNode && selectedNode.id === node.id)}
      <circle cx={node.x} cy={node.y} r="25" fill="red" />
    {/if}
    <circle cx={node.x} cy={node.y} r="20" fill="blue" onmousedown={(event: MouseEvent) => onNodeClick(event, node)} />
    <text x={node.x} y={node.y + 5} text-anchor="middle" fill="white">
      {node.label}
    </text>
  {/each}
</svg>