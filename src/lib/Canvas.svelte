<script lang="ts">
  import { mindMap } from "$lib/store/mindMap.store";
  import {type Link, type Node} from "$lib/models/element.model.js";
  import {findFirstNode, getNewNodePosition} from "$lib/geo";

  let dragging = false;
  let selectedNode : Node | null = null;
  let nodes : Node[];
  let links : Link[];

  let updateNodeLabel = "";
  let newNodeLabel = "";

  $: if (selectedNode) {
      updateNodeLabel = selectedNode.label;
  }

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

  function updateNode() {
      if (selectedNode && updateNodeLabel !== "") {
          mindMap.updateNodeLabel(selectedNode.id, updateNodeLabel);
      }
  }

  function addNode() {
      if (selectedNode && newNodeLabel !== "") {
          let { x, y } = getNewNodePosition(selectedNode);
          let newNode = mindMap.addNode(newNodeLabel, x, y);
          mindMap.addLink(selectedNode.id, newNode.id);
          newNodeLabel = "";
      }
  }

  function removeNode() {
      if (selectedNode && nodes.length > 1) {
          let linksMap = nodes.map(node => node.id)
              .reduce((map, id) => map.set(id, links.filter(link => link.from === id).map(link => findFirstNode(nodes, link.to))), new Map<string, Node[]>());
          removeNodeRec(selectedNode, linksMap);
      }
  }

  function removeNodeRec(node: Node, linksMap: Map<string, Node[]>) {
      let neighbors = linksMap.get(node.id) ?? [];
      neighbors.forEach(neighbor => {
          removeNodeRec(neighbor, linksMap);
      });
      mindMap.removeNode(node.id);
  }
</script>

<style>
  .canvas {
      background-color: white;
  }

  .selected {
      stroke: red;
      stroke-width: 2;
  }

  input {
      color: black;
      border-radius: 5px;
      padding: 0 4px 0 4px;
  }

  button:disabled {
      color: gray;
  }

  text {
      user-select: none;
      pointer-events: none;
  }
</style>

<div class="flex items-center gap-3">
  <div class="w-2/4 text-center m-3">
    <button disabled={!selectedNode} onclick={addNode}>Add node</button>
    <input disabled={!selectedNode} bind:value={newNodeLabel} placeholder="Name of the new node" />
  </div>
  <div class="w-2/4 text-center m-3">
    <button disabled={!selectedNode} onclick={removeNode}>Remove node</button>
    <button disabled={!selectedNode} onclick={updateNode}>Update node</button>
    <input disabled={!selectedNode} bind:value={updateNodeLabel} />
  </div>
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
    <circle
        class:selected={selectedNode && selectedNode.id === node.id}
        cx={node.x}
        cy={node.y}
        r="20"
        fill="blue"
        onmousedown={(event: MouseEvent) => onNodeClick(event, node)} />
    <text x={node.x} y={node.y + 5} text-anchor="middle" fill="white">
      {node.label}
    </text>
  {/each}
</svg>