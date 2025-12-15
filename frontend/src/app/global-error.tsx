"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center space-y-4 p-8">
          <h2 className="text-2xl font-bold">Algo deu errado!</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error.message || "Erro crítico na aplicação"}
          </p>
          {error.digest && <p className="text-xs text-gray-400">Digest: {error.digest}</p>}
          <button
            onClick={() => reset()}
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
