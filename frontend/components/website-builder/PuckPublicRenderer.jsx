
"use client";

import React, { Component } from "react";
import { Render } from "@puckeditor/core";
import puckConfig from "./puck-config";

class PuckErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(
      "PuckPublicRenderer rendering error:",
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-red-600 bg-red-50 border border-red-200 rounded-xl my-4">
          <p className="font-semibold">
            Unable to render component block
          </p>
          <p className="text-xs text-red-500 mt-1">
            {this.state.error?.message || "Render error"}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function PuckPublicRenderer({ data }) {
  let parsedData = data;

  if (typeof data === "string") {
    try {
      parsedData = JSON.parse(data);
    } catch {
      return null;
    }
  }

  if (
    !parsedData ||
    !Array.isArray(parsedData.content) ||
    !parsedData.root ||
    typeof parsedData.root !== "object"
  ) {
    return null;
  }

  return (
    <PuckErrorBoundary>
      <div
        className="puck-public-responsive-container"
        style={{
          width: "100%",
          minWidth: 0,
          containerType: "inline-size",
          containerName: "studio-preview",
        }}
      >
        <Render
          config={puckConfig}
          data={parsedData}
        />
      </div>
    </PuckErrorBoundary>
  );
}
