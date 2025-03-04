<script lang="ts">
  import { mindMap } from "$lib/store/mindMap.store";
  import {type Node} from "$lib/models/element.model.js";
  import {getNewNodePosition} from "$lib/geo";

  let movingNode = false;
  let mouseX = 0;
  let mouseY = 0;
  let selectedNodeId: string | null = null;
  let nodesMap: Map<string, Node>;

  let selectedNodeLabel = "";
  let newNodeLabel = "";

  $: if (selectedNodeId) {
      selectedNodeLabel = nodesMap.get(selectedNodeId)?.label || "Node not found?";
  }

  mindMap.nodes.subscribe((storedNodes: Map<string, Node>) => nodesMap = storedNodes);

  function onNodeClick(event: MouseEvent, element: Node) {
      event.stopPropagation();
      selectedNodeId = element.id;
      movingNode = true;
      mouseX = event.offsetX;
      mouseY = event.offsetY;
  }

  function moveNode(event: MouseEvent) {
      if (movingNode && selectedNodeId) {
          mindMap.updateNodePosition(selectedNodeId, event.offsetX - mouseX, event.offsetY - mouseY);
          mouseX = event.offsetX;
          mouseY = event.offsetY;
      }
  }

  function onMouseUp() {
      movingNode = false;
  }

  function updateNode() {
      if (selectedNodeId && selectedNodeLabel !== "") {
          mindMap.updateNodeLabel(selectedNodeId, selectedNodeLabel);
      }
  }

  function addNode() {
      if (selectedNodeId && newNodeLabel !== "") {
          let { x, y } = getNewNodePosition(nodesMap.get(selectedNodeId)!);
          mindMap.addNode(newNodeLabel, x, y, selectedNodeId);
          newNodeLabel = "";
      }
  }

  function removeNode() {
      if (selectedNodeId && nodesMap.size > 1) {
          removeNodeRec(selectedNodeId);
      }
  }

  function removeNodeRec(nodeId: string) {
      nodesMap.get(nodeId)!.children.forEach(child => {
          removeNodeRec(child);
      });
      mindMap.removeNode(nodeId);
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
    <button disabled={!selectedNodeId} onclick={addNode}>Add node</button>
    <input disabled={!selectedNodeId} bind:value={newNodeLabel} placeholder="Name of the new node" />
  </div>
  <div class="w-2/4 text-center m-3">
    <button disabled={!selectedNodeId} onclick={removeNode}>Remove node</button>
    <button disabled={!selectedNodeId} onclick={updateNode}>Update node</button>
    <input disabled={!selectedNodeId} bind:value={selectedNodeLabel} />
  </div>
</div>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<svg width="1000px" height="600px" class="canvas" onmousemove={moveNode} onmouseup={onMouseUp} onmousedown={() => selectedNodeId = null} >
  {#each nodesMap.values() as node}
    {#each node.children as childId}
      {#if nodesMap.has(childId)}
      <line
          x1={node.x} y1={node.y}
          x2={nodesMap.get(childId)?.x} y2={nodesMap.get(childId)?.y}
          stroke="black" stroke-width="2"
      />
      {/if}
    {/each}
    <circle
        class:selected={selectedNodeId && selectedNodeId === node.id}
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