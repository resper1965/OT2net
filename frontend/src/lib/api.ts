/**
 * Cliente API para comunicação com o backend
 * No Vercel: usa serverless functions em /api/*
 * Em desenvolvimento local: usa NEXT_PUBLIC_API_URL ou /api/* (via rewrite)
 */

// No Vercel, as rotas /api/* são automaticamente servidas pelas serverless functions
// Em desenvolvimento local, se NEXT_PUBLIC_API_URL estiver definido, usa o backend Express
// Caso contrário, usa /api/* que será reescrito para o backend Express
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const { supabase } = await import("./supabase/client");
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || null;
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Se API_URL estiver definido (desenvolvimento local), usa ele
  // Caso contrário, usa endpoint relativo que será servido pelas serverless functions no Vercel
  const url = API_URL ? `${API_URL}${endpoint}` : endpoint;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Verificar se a resposta é JSON antes de retornar
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
    // Se não for JSON mas estiver OK, retornar resposta vazia
    return response;
  }

  return response;
}

export const api = {
  // Clientes
  clientes: {
    list: () => fetchWithAuth("/api/clientes").then((r) => r.json()).then((data) => data.clientes || []),
    get: (id: string) => fetchWithAuth(`/api/clientes/${id}`).then((r) => r.json()),
    create: (data: Record<string, unknown>) =>
      fetchWithAuth("/api/clientes", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: Record<string, unknown>) =>
      fetchWithAuth(`/api/clientes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) =>
      fetchWithAuth(`/api/clientes/${id}`, {
        method: "DELETE",
      }),
  },

  // Empresas
  empresas: {
    list: (clienteId?: string) => {
      const url = clienteId ? `/api/empresas?cliente_id=${clienteId}` : "/api/empresas";
      return fetchWithAuth(url).then((r) => r.json()).then((data) => data.empresas || []);
    },
    get: (id: string) => fetchWithAuth(`/api/empresas/${id}`).then((r) => r.json()),
    create: (data: Record<string, unknown>) =>
      fetchWithAuth("/api/empresas", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: Record<string, unknown>) =>
      fetchWithAuth(`/api/empresas/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) =>
      fetchWithAuth(`/api/empresas/${id}`, {
        method: "DELETE",
      }),
  },

  // Sites
  sites: {
    list: (empresaId?: string) => {
      const url = empresaId ? `/api/sites?empresa_id=${empresaId}` : "/api/sites";
      return fetchWithAuth(url).then((r) => r.json());
    },
    get: (id: string) => fetchWithAuth(`/api/sites/${id}`).then((r) => r.json()),
    create: (data: Record<string, unknown>) =>
      fetchWithAuth("/api/sites", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: Record<string, unknown>) =>
      fetchWithAuth(`/api/sites/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) =>
      fetchWithAuth(`/api/sites/${id}`, {
        method: "DELETE",
      }),
  },

  // Stakeholders
  stakeholders: {
    list: (projetoId?: string) => {
      const url = projetoId ? `/api/stakeholders?projeto_id=${projetoId}` : "/api/stakeholders";
      return fetchWithAuth(url).then((r) => r.json());
    },
    get: (id: string) => fetchWithAuth(`/api/stakeholders/${id}`).then((r) => r.json()),
    create: (data: Record<string, unknown>) =>
      fetchWithAuth("/api/stakeholders", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: Record<string, unknown>) =>
      fetchWithAuth(`/api/stakeholders/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) =>
      fetchWithAuth(`/api/stakeholders/${id}`, {
        method: "DELETE",
      }),
  },

  // Membros da Equipe
  membrosEquipe: {
    list: (projetoId?: string) => {
      const url = projetoId ? `/api/membros-equipe?projeto_id=${projetoId}` : "/api/membros-equipe";
      return fetchWithAuth(url).then((r) => r.json());
    },
    get: (id: string) => fetchWithAuth(`/api/membros-equipe/${id}`).then((r) => r.json()),
    create: (data: Record<string, unknown>) =>
      fetchWithAuth("/api/membros-equipe", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: Record<string, unknown>) =>
      fetchWithAuth(`/api/membros-equipe/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) =>
      fetchWithAuth(`/api/membros-equipe/${id}`, {
        method: "DELETE",
      }),
  },

  // Projetos
  projetos: {
    list: (clienteId?: string) => {
      const url = clienteId ? `/api/projetos?cliente_id=${clienteId}` : "/api/projetos";
      return fetchWithAuth(url).then((r) => r.json()).then((data) => data.projetos || []);
    },
    get: (id: string) => fetchWithAuth(`/api/projetos/${id}`).then((r) => r.json()),
    create: (data: Record<string, unknown>) =>
      fetchWithAuth("/api/projetos", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: Record<string, unknown>) =>
      fetchWithAuth(`/api/projetos/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) =>
      fetchWithAuth(`/api/projetos/${id}`, {
        method: "DELETE",
      }),
  },

  // Relatórios
  relatorios: {
    generateOnboarding: (projetoId: string) =>
      fetchWithAuth("/api/relatorios/onboarding", {
        method: "POST",
        body: JSON.stringify({ projeto_id: projetoId }),
      }).then((r) => r.json()),
    getOnboarding: (projetoId: string) =>
      fetchWithAuth(`/api/relatorios/onboarding/${projetoId}`).then((r) => r.json()),
  },

  // Descrições Raw (US2)
  descricoesRaw: {
    list: (projetoId?: string, siteId?: string, status?: string) => {
      const params = new URLSearchParams();
      if (projetoId) params.append("projeto_id", projetoId);
      if (siteId) params.append("site_id", siteId);
      if (status) params.append("status", status);
      const url = params.toString() ? `/api/descricoes-raw?${params}` : "/api/descricoes-raw";
      return fetchWithAuth(url).then((r) => r.json());
    },
    get: (id: string) => fetchWithAuth(`/api/descricoes-raw/${id}`).then((r) => r.json()),
    create: (data: Record<string, unknown>) =>
      fetchWithAuth("/api/descricoes-raw", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: Record<string, unknown>) =>
      fetchWithAuth(`/api/descricoes-raw/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) =>
      fetchWithAuth(`/api/descricoes-raw/${id}`, {
        method: "DELETE",
      }),
    processar: (id: string, criarProcesso: boolean = false) =>
      fetchWithAuth(`/api/descricoes-raw/${id}/processar?criar_processo=${criarProcesso}`, {
        method: "POST",
      }).then((r) => r.json()),
  },

  // Processos Normalizados
  processosNormalizados: {
    list: (projetoId?: string, status?: string) => {
      const params = new URLSearchParams();
      if (projetoId) params.append("projeto_id", projetoId);
      if (status) params.append("status", status);
      const url = params.toString()
        ? `/api/processos-normalizados?${params}`
        : "/api/processos-normalizados";
      return fetchWithAuth(url).then((r) => r.json());
    },
    get: (id: string) => fetchWithAuth(`/api/processos-normalizados/${id}`).then((r) => r.json()),
    update: (id: string, data: Record<string, unknown>) =>
      fetchWithAuth(`/api/processos-normalizados/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    getDiagrama: (id: string, tipo: "flowchart" | "sequence" | "state" = "flowchart") =>
      fetchWithAuth(`/api/processos-normalizados/${id}/diagrama?tipo=${tipo}`).then((r) =>
        r.json()
      ),
  },

  // Usuários (apenas admin)
  usuarios: {
    list: () => fetchWithAuth("/api/usuarios").then((r) => r.json()),
    get: (id: string) => fetchWithAuth(`/api/usuarios/${id}`).then((r) => r.json()),
    create: (data: Record<string, unknown>) =>
      fetchWithAuth("/api/usuarios", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: Record<string, unknown>) =>
      fetchWithAuth(`/api/usuarios/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) =>
      fetchWithAuth(`/api/usuarios/${id}`, {
        method: "DELETE",
      }).then((r) => r.json()),
  },
};
