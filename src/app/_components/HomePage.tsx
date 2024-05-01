"use client";
import Flow from "@/app/_components/Flow";
import Form from "@/app/_components/Form";
import TableNode from "@/components/TableNode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ELK from "elkjs/lib/elk.bundled.js";
import { NodeTypes, ReactFlowProvider } from "reactflow";

import "reactflow/dist/style.css";

const elk = new ELK();

const elkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "80",
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

      // Hardcode a width and height for elk to use when layouting.
      width: 150,
      height: 500,
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

const HomePage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Tabs defaultValue="form" className="w-full">
        <div className="fixed top-0 w-full z-10">
          <TabsList className="flex items-center justify-center w-full grid-cols-2">
            <TabsTrigger value="form">Form</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 w-full h-full absolute">
          <TabsContent
            value="form"
            className="flex-1 w-full h-full absolute pt-8 m-0"
          >
            <div className="w-full h-full"><Form /></div>
          </TabsContent>
          <TabsContent
            value="preview"
            className="flex-1 w-full h-full absolute pt-8 m-0"
          >
            <ReactFlowProvider>
              <Flow />
            </ReactFlowProvider>
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
};

export default HomePage;
