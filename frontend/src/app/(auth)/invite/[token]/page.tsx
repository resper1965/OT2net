'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

export default function InvitePage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [inviteData, setInviteData] = useState<any>(null)

  useEffect(() => {
    // TODO: Validar token do convite via API
    // Por enquanto, apenas permite o registro
    setValidating(false)
  }, [token])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres')
      setLoading(false)
      return
    }

    try {
      // TODO: Validar token antes de criar conta
      // const { data: invite } = await fetch(`/api/invites/${token}`)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome,
            invite_token: token, // Token do convite
          },
        },
      })

      if (error) throw error

      if (data.user) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-slate-800 p-8 shadow-xl text-center">
          <div className="text-slate-400">Validando convite...</div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-slate-800 p-8 shadow-xl text-center">
          <div className="text-green-400 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-slate-100">
            Conta criada com sucesso!
          </h2>
          <p className="text-slate-400">
            Verifique seu email para confirmar a conta.
            <br />
            Redirecionando para o login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-slate-800 p-8 shadow-xl">
        <div>
          <h2 className="text-center text-3xl font-bold text-slate-100">
            Aceitar convite
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Complete seu cadastro para acessar a plataforma
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-slate-300"
              >
                Nome completo
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-slate-100 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="João Silva"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-slate-100 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300"
              >
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-slate-100 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-400"
              >
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-slate-100 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Digite a senha novamente"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary px-4 py-2 font-medium text-white hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50"
            >
              {loading ? 'Criando conta...' : 'Aceitar convite e criar conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

