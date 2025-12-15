"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <h2 className="text-xl font-bold">Algo deu errado!</h2>
      <p className="text-muted-foreground">{error.message || "Erro desconhecido"}</p>
      {error.digest && <p className="text-xs text-muted-foreground">Digest: {error.digest}</p>}
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Tentar novamente
      </Button>
    </div>
  );
}
