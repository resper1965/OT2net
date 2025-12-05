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

// GET /api/usuarios - Listar usuários (apenas admin)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const admin = await isAdmin(user.id);
    if (!admin) {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
    }

    const usuarios = await prisma.usuario.findMany({
      orderBy: {
        created_at: "desc",
      },
      include: {
        permissoes: true,
      },
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return NextResponse.json(
      { error: "Erro ao listar usuários" },
      { status: 500 }
    );
  }
}

// POST /api/usuarios - Criar usuário (apenas admin)
export async function POST(request: NextRequest) {
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
    const { email, nome, perfil, organizacao, senha } = body;

    if (!email || !nome) {
      return NextResponse.json(
        { error: "Email e nome são obrigatórios" },
        { status: 400 }
      );
    }

    // Criar usuário no Supabase Auth
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: senha || "senha123", // Senha padrão, deve ser alterada
      email_confirm: true,
      user_metadata: {
        full_name: nome,
        name: nome,
        perfil: perfil || "Consultor",
      },
    });

    if (authError || !authUser.user) {
      return NextResponse.json(
        { error: authError?.message || "Erro ao criar usuário no Supabase" },
        { status: 400 }
      );
    }

    // Criar registro na tabela usuarios
    const usuario = await prisma.usuario.create({
      data: {
        supabase_user_id: authUser.user.id,
        email,
        nome,
        perfil: perfil || "Consultor",
        organizacao: organizacao || null,
        status: "ativo",
      },
      include: {
        permissoes: true,
      },
    });

    return NextResponse.json(usuario, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar usuário" },
      { status: 500 }
    );
  }
}

