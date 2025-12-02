import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables for backend')
}

/**
 * Cliente Supabase para uso no backend (Express)
 * Usa Service Role Key para bypass de RLS quando necessário
 * 
 * ⚠️ ATENÇÃO: Nunca exponha a Service Role Key no frontend!
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * Valida token JWT do Supabase e retorna o usuário
 */
export async function verifySupabaseToken(token: string) {
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error || !user) {
      return null
    }
    
    return user
  } catch (error) {
    return null
  }
}


