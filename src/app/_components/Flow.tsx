"use client";

import DirectionButton from "@/components/DirectionButton";
import DownloadButton from "@/components/DownloadButton";
import { EditModal } from "@/components/EditModal";
import SaveFileButton from "@/components/SaveFileButton";
import TableNode from "@/components/TableNode";
import { Button } from "@/components/ui/button";
import { initialEdges, initialNodes } from "@/lib/node";
import ELK from "elkjs/lib/elk.bundled.js";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  NodeTypes,
  Panel,
  addEdge,
  useEdgesState,
  useNodesState,
  useOnSelectionChange,
  useReactFlow,
} from "reactflow";

import "reactflow/dist/style.css";

const elk = new ELK();

const elkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "100",
};

const getLayoutedElements = (nodes: any, edges: any, options: any = {}) => {
  const isHorizontal = options?.["elk.direction"] === "RIGHT";
  const graph = {
    id: "root",
    layoutOptions: options,
    children: nodes.map((node: any) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",

      // TODO: calculate a width and height for elk to use when layouting.
      width: 500,
      height: 400,
    })),
    edges: edges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children!.map((node) => ({
        ...node,
        // React Flow expects a position property on the node instead of `x`
        // and `y` fields.
        position: { x: node.x, y: node.y },
      })),

      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};

const nodeTypes: NodeTypes = {
  table: TableNode as any,
};

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<any[any]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<any[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<any[]>([]);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState<any>([]);

  const { fitView } = useReactFlow();

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) => {
        console.log(params, eds);
        return addEdge({ ...params, type: "step" }, eds);
      }),
    []
  );

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      setSelectedNodes(nodes.map((node) => node.id));
      setSelectedEdges(edges.map((edge) => edge.id));
    },
  });

  const onLayout = useCallback(
    ({ direction, useInitialNodes = false, isFitView = false }: any) => {
      const opts = { "elk.direction": direction, ...elkOptions };
      const ns = useInitialNodes ? initialNodes : nodes;
      const es = useInitialNodes ? initialEdges : edges;

      getLayoutedElements(ns, es, opts).then(
        ({ nodes: layoutedNodes, edges: layoutedEdges }: any) => {
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);

          isFitView && window.requestAnimationFrame(() => fitView());
        }
      );
    },
    [nodes, edges]
  );
  const onChangeDirectionMode = (dc: boolean) => {
    onLayout({ direction: dc ? "DOWN" : "RIGHT" })
  }

  // Calculate the initial layout on mount.
  useLayoutEffect(() => {
    onLayout({ direction: "RIGHT", useInitialNodes: false, fitView: true });
  }, []);

  useEffect(() => {
    setSelectedNodeData(() => {
      if (selectedNodes.length === 0) return null;
      return nodes.find((node) => node.id === selectedNodes[0]);
    });
  }, [selectedNodes]);

  const onEditHandler = (data: any) => {
    // TODO: disabled if selected > 1
    console.log("selectedNodes", selectedNodes);
    console.log("selectedEdges", selectedEdges);
    console.log("Edited data", data);
    if (data.id) {
      setNodes((prevNodes) => {
        const newNodes: any[any] = [...(prevNodes || [])];
        const editedNodeIndex = newNodes.findIndex(
          (node: any) => node.id === data.id
        );
        if (editedNodeIndex) {
          newNodes[editedNodeIndex] = {
            ...newNodes[editedNodeIndex],
            data: {
              ...newNodes[editedNodeIndex].data,
              columns: data.columns,
            },
          };
        }
        return newNodes;
      });
    }
    setOpenEditModal(false);
  };

  const onUploadHandler = (e: any) => {
    const fileReader = new FileReader();
    const { files } = e.target;

    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = e => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        const { nodes: initialNodes, edges: initialEdges } = JSON.parse(content)
        setNodes(initialNodes);
        setEdges(initialEdges);
      }
    };
  }


  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      elementsSelectable
    >
      <Panel position="top-right">


        <div className="h-20 flex gap-5">
          <label className="bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 rounded-md inline-flex justify-center items-center px-4 py-2" >
            Load (File upload)
            <input hidden onChange={onUploadHandler} type="file" />
          </label>
          {selectedNodeData && (
            <EditModal
              openEditModal={openEditModal}
              setOpenEditModal={setOpenEditModal}
              item={selectedNodeData}
              onEdit={onEditHandler}
            ></EditModal>
          )}
          <SaveFileButton nodes={nodes} edges={edges}></SaveFileButton>
          <Button>Generate (API)</Button>
          {/* <DirectionButton onClick={(dc) => onChangeDirectionMode(dc)} /> */}
          <Button onClick={() => onLayout({ direction: "DOWN" })}>
            Vertical layout
          </Button>
          <Button onClick={() => onLayout({ direction: "RIGHT" })}>
            Horizontal layout
          </Button>
        </div>
      </Panel>
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      <MiniMap />
      <Controls />
      <DownloadButton />
    </ReactFlow >
  );
};

export default Flow;
