
import { Render } from "@puckeditor/core";
import puckConfig from "./puck-config";

export default function PuckPublicRenderer({ data }) {
  if (
    !data ||
    !Array.isArray(data.content) ||
    !data.root ||
    typeof data.root !== "object"
  ) {
    return null;
  }

  return (
    <Render
      config={puckConfig}
      data={data}
    />
  );
}
