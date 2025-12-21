"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, Terminal } from "lucide-react";

export default function SetupPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [logs, setLogs] = useState<{ type: 'success' | 'error' | 'info', message: string, detail?: string }[]>([]);

  const addLog = (type: 'success' | 'error' | 'info', message: string, detail?: string) => {
    setLogs(prev => [...prev, { type, message, detail }]);
  };

  const executeAction = async (action: 'migrate' | 'seed') => {
    if (!user) {
      addLog('error', 'Usuário não autenticado');
      return;
    }

    setLoading(action);
    addLog('info', `Iniciando ${action === 'migrate' ? 'Migração' : 'Seed'}...`);

    try {
      const token = await user.getIdToken();
      const endpoint = action === 'migrate' 
        ? `${process.env.NEXT_PUBLIC_API_URL || 'https://ot2net-backend-661727503610.us-central1.run.app/api'}/admin/migrate`
        : `${process.env.NEXT_PUBLIC_API_URL || 'https://ot2net-backend-661727503610.us-central1.run.app/api'}/admin/seed-fases`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }

      addLog('success', `${action === 'migrate' ? 'Migração' : 'Seed'} concluído com sucesso!`, data.output);
    } catch (error: unknown) {
      console.error(error);
      addLog('error', `Falha ao executar ${action}`, (error as Error).message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Setup do Sistema</h1>
        <p className="text-zinc-500 mt-2">Ferramentas de inicialização e manutenção do banco de dados.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              1. Migração de Banco (Schema)
            </CardTitle>
            <CardDescription>
              Cria as tabelas necessárias no banco de dados. Execute isso primeiro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => executeAction('migrate')} 
              disabled={!!loading}
              className="w-full"
            >
              {loading === 'migrate' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Executar Migração
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              2. Seed de Dados (Fases)
            </CardTitle>
            <CardDescription>
              Popula o banco com as 5 fases padrão e checklists. Execute após a migração.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => executeAction('seed')} 
              disabled={!!loading}
              variant="secondary"
              className="w-full"
            >
              {loading === 'seed' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Executar Seed
            </Button>
          </CardContent>
        </Card>
      </div>

      {logs.length > 0 && (
        <Card className="bg-zinc-950 text-zinc-50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-mono">Logs de Execução</CardTitle>
          </CardHeader>
          <CardContent className="font-mono text-sm space-y-4 max-h-[400px] overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className={`border-l-2 pl-3 ${
                log.type === 'success' ? 'border-green-500' : 
                log.type === 'error' ? 'border-red-500' : 'border-blue-500'
              }`}>
                <div className={`font-semibold ${
                  log.type === 'success' ? 'text-green-400' : 
                  log.type === 'error' ? 'text-red-400' : 'text-blue-400'
                }`}>
                  {log.message}
                </div>
                {log.detail && (
                  <pre className="mt-1 text-xs text-zinc-400 whitespace-pre-wrap bg-zinc-900/50 p-2 rounded">
                    {log.detail}
                  </pre>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
