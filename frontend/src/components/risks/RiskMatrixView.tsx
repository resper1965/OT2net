interface RiskMatrixViewProps {
  riscos: any[];
}

export function RiskMatrixView({ riscos }: RiskMatrixViewProps) {
  // Create 5x5 matrix
  const matrix = Array(5).fill(null).map(() => Array(5).fill([]));
  
  riscos.forEach((risco) => {
    const prob = (risco.probabilidade || 1) - 1;
    const impact = Math.max(risco.impacto_seguranca || 1, risco.impacto_operacional || 1) - 1;
    if (prob >= 0 && prob < 5 && impact >= 0 && impact < 5) {
      if (!Array.isArray(matrix[prob][impact])) {
        matrix[prob][impact] = [];
      }
      matrix[prob][impact].push(risco);
    }
  });

  const getCellColor = (prob: number, impact: number) => {
    const score = (prob + 1) * (impact + 1);
    if (score >= 20) return "bg-red-500";
    if (score >= 12) return "bg-orange-500";
    if (score >= 6) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="grid grid-cols-6 gap-2">
      <div className="col-span-1"></div>
      {[5, 4, 3, 2, 1].map((impact) => (
        <div key={`impact-${impact}`} className="text-center text-sm font-medium">
          {impact}
        </div>
      ))}
      
      {[5, 4, 3, 2, 1].map((prob) => (
        <>
          <div key={`prob-${prob}`} className="flex items-center justify-center text-sm font-medium">
            {prob}
          </div>
          {[4, 3, 2, 1, 0].map((impact) => {
            const risks = matrix[prob - 1][impact] || [];
            return (
              <div
                key={`cell-${prob}-${impact}`}
                className={`h-20 rounded border border-zinc-300 dark:border-zinc-700 ${getCellColor(prob - 1, impact)} bg-opacity-20 flex items-center justify-center text-xs font-semibold`}
              >
                {risks.length > 0 && (
                  <span className="bg-white dark:bg-zinc-900 px-2 py-1 rounded">
                    {risks.length}
                  </span>
                )}
              </div>
            );
          })}
        </>
      ))}
      
      <div className="col-span-6 mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
        <div className="flex justify-between">
          <span>← Impacto →</span>
          <span className="rotate-90 transform origin-center">Probabilidade →</span>
        </div>
      </div>
    </div>
  );
}
