"use client";

import { useEffect, useRef, useState } from "react";
// bpmn-js requires window, so we dynamic import or ensure client-side only
import BpmnViewer from "bpmn-js/lib/NavigatedViewer";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";

interface BPMNViewerProps {
  xml?: string; // We'll support XML injection
  json?: any;   // Or we might need a converter if the AI gives pure JSON, but standardized tools use XML.
                // VertexAI instruction was to return JSON structure *representing* BPMN elements.
                // We'll need a converter JSON -> XML if bpmn-js only takes XML. 
                // For now, let's assume we might receive XML or we convert raw JSON to XML on the client.
}

export default function BPMNViewer({ xml }: BPMNViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize viewer if not already
    if (!viewerRef.current) {
      viewerRef.current = new BpmnViewer({
        container: containerRef.current,
        keyboard: {
          bindTo: window
        }
      });
    }

    const viewer = viewerRef.current;

    if (xml) {
      viewer
        .importXML(xml)
        .then(({ warnings }: any) => {
          if (warnings.length) {
            console.warn("BPMN Import Warnings", warnings);
          }
          const canvas = viewer.get("canvas");
          canvas.zoom("fit-viewport");
        })
        .catch((err: any) => {
          console.error("BPMN Import Error", err);
        });
    }

    return () => {
       // cleanup if needed, though usually fine to keep unless component unmounts
       // viewer.destroy(); 
    };
  }, [xml]);

  return (
    <div className="w-full h-[500px] border rounded-lg bg-white relative">
        <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
