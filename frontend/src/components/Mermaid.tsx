"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ref.current || !chart) {return;}

    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "Inter, sans-serif",
      themeVariables: {
        primaryColor: "#00ade8",
        primaryTextColor: "#000",
        primaryBorderColor: "#00ade8",
        lineColor: "#333",
        secondaryColor: "#f0f0f0",
        tertiaryColor: "#fff",
      },
    });

    const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const element = document.createElement("div");
    element.className = "mermaid";
    element.id = id;
    element.textContent = chart;
    ref.current.innerHTML = "";
    ref.current.appendChild(element);

    mermaid
      .run({
        nodes: [element],
      })
      .catch((err) => {
        const errorMessage = err instanceof Error ? err.message : "Erro ao renderizar diagrama";
        setError(errorMessage);
      });
  }, [chart]);

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        Erro ao renderizar diagrama: {error}
      </div>
    );
  }

  return <div ref={ref} className="mermaid-container" />;
}
