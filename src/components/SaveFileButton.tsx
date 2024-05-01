import { useCallback } from "react";
import { Button } from "./ui/button";

function downloadImage(dataUrl: string) {
  const a = document.createElement("a");
  a.setAttribute("download", "reactflow.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

type Props = {
  nodes: any,
  edges: any
}

function SaveFileButton({ nodes, edges }: Props) {
  const onClick = useCallback(
    () => {
      const data = {
        nodes,
        edges
      }
      const element = document.createElement("a");
      const textFile = new Blob([JSON.stringify(data)], { type: 'json' });
      element.href = URL.createObjectURL(textFile);
      element.download = "flows.json";
      document.body.appendChild(element);
      element.click();
    }
    , [nodes, edges]);

  return (
    <Button className="download-btn" onClick={onClick}>
      Save
    </Button>
  );
}

export default SaveFileButton;
