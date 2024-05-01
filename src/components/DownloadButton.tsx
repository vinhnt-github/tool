import { toPng } from "html-to-image";
import {
  Panel,
  getRectOfNodes,
  getTransformForBounds,
  useReactFlow,
} from "reactflow";
import { Button } from "./ui/button";

function downloadImage(dataUrl: string) {
  const a = document.createElement("a");

  a.setAttribute("download", "reactflow.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

function DownloadButton() {
  const { getNodes } = useReactFlow();
  const onClick = () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const viewport = document.querySelector(".react-flow__viewport");
    if (!viewport) return;
    const nodesBounds = getRectOfNodes(getNodes());
    const transform = getTransformForBounds(
      nodesBounds,
      viewport.clientWidth,
      viewport.clientHeight,
      0.5,
      2
    );
    viewport &&
      toPng(viewport as HTMLElement, {
        backgroundColor: "#fff",
        width: viewport.clientWidth,
        height: viewport.clientHeight,
        style: {
          width: viewport.clientWidth.toString() + "px",
          height: viewport.clientHeight.toString() + "px",
        },
      }).then(downloadImage);
  };

  return (
    <Panel position="bottom-center">
      <Button className="download-btn" onClick={onClick}>
        Download Image
      </Button>
    </Panel>
  );
}

export default DownloadButton;
