import { usePageTitle } from "@/contexts/PageTitleContext";
import { DashboardKPIs } from "@/components/dashboard/DashboardKPIs";
import { ProjectPhasesTimeline } from "@/components/dashboard/ProjectPhasesTimeline";

export default function DashboardPage() {
  const { setTitle } = usePageTitle();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Visão geral do sistema OT2net
        </p>
      </div>

      {/* Phase Indicator */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
          <div>
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
              Fase 0: Discovery & AS-IS
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Coleta e normalização de processos operacionais
            </p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <DashboardKPIs />

      {/* Project Phases Timeline */}
      <ProjectPhasesTimeline />
    </div>
  );
}
