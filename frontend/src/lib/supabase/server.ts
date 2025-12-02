import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

/**
 * Cria cliente Supabase para uso em Server Components e Server Actions
 * Usa cookies para manter sessão entre requisições
 */
export function createServerClient() {
  const cookieStore = cookies();

  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(
        name: string,
        value: string,
        options?: {
          path?: string;
          maxAge?: number;
          httpOnly?: boolean;
          secure?: boolean;
          sameSite?: "strict" | "lax" | "none";
        }
      ) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(
        name: string,
        options?: {
          path?: string;
          maxAge?: number;
          httpOnly?: boolean;
          secure?: boolean;
          sameSite?: "strict" | "lax" | "none";
        }
      ) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
