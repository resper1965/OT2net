import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Helper para verificar se usuário é admin
async function isAdmin(userId: string): Promise<boolean> {
  try {
    const usuario = await prisma.usuario.findFirst({
      where: {
        supabase_user_id: userId,
        perfil: "admin",
      },
    });
    return !!usuario;
  } catch (error) {
    console.error("Erro ao verificar perfil admin:", error);
    return false;
  }
}

// Helper para obter usuário atual do token
async function getCurrentUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return user;
}

// GET /api/usuarios/:id - Obter usuário específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const admin = await isAdmin(user.id);
    if (!admin) {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: params.id,
      },
      include: {
        permissoes: true,
      },
    });

    if (!usuario) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error("Erro ao obter usuário:", error);
    return NextResponse.json(
      { error: "Erro ao obter usuário" },
      { status: 500 }
    );
  }
}

// PATCH /api/usuarios/:id - Atualizar usuário
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const admin = await isAdmin(user.id);
    if (!admin) {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
    }

    const body = await request.json();
    const { nome, perfil, organizacao, status } = body;

    // Buscar usuário atual
    const usuarioAtual = await prisma.usuario.findUnique({
      where: { id: params.id },
    });

    if (!usuarioAtual) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Atualizar no Prisma
    const usuario = await prisma.usuario.update({
      where: { id: params.id },
      data: {
        ...(nome && { nome }),
        ...(perfil && { perfil }),
        ...(organizacao !== undefined && { organizacao }),
        ...(status && { status }),
        updated_at: new Date(),
      },
      include: {
        permissoes: true,
      },
    });

    // Atualizar metadata no Supabase Auth se necessário
    if (nome || perfil) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      if (usuarioAtual.supabase_user_id) {
        await supabase.auth.admin.updateUserById(usuarioAtual.supabase_user_id, {
          user_metadata: {
            full_name: nome || usuarioAtual.nome,
            name: nome || usuarioAtual.nome,
            perfil: perfil || usuarioAtual.perfil,
          },
        });
      }
    }

    return NextResponse.json(usuario);
  } catch (error: any) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao atualizar usuário" },
      { status: 500 }
    );
  }
}

// DELETE /api/usuarios/:id - Deletar usuário
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const admin = await isAdmin(user.id);
    if (!admin) {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
    }

    // Buscar usuário atual
    const usuarioAtual = await prisma.usuario.findUnique({
      where: { id: params.id },
    });

    if (!usuarioAtual) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Não permitir deletar a si mesmo
    if (usuarioAtual.supabase_user_id === user.id) {
      return NextResponse.json(
        { error: "Não é possível deletar seu próprio usuário" },
        { status: 400 }
      );
    }

    // Deletar do Supabase Auth
    if (usuarioAtual.supabase_user_id) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      await supabase.auth.admin.deleteUser(usuarioAtual.supabase_user_id);
    }

    // Deletar do Prisma (permissoes serão deletadas em cascade)
    await prisma.usuario.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Usuário deletado com sucesso" });
  } catch (error: any) {
    console.error("Erro ao deletar usuário:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao deletar usuário" },
      { status: 500 }
    );
  }
}

