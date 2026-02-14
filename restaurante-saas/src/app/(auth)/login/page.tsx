"use client"

import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppwriteException } from "appwrite"
import { account } from "@/lib/appwrite"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      try {
        await account.get()
        router.replace("/dashboard")
      } catch {
        // User is not logged in; keep login page.
      }
    }

    void checkSession()
  }, [router])

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (loading) return

    if (!email.trim() || !password) {
      setError("Completa correo y contrasena.")
      return
    }

    setLoading(true)
    setError("")

    try {
      await account.createEmailPasswordSession(email.trim(), password)
      router.replace("/dashboard")
    } catch (err: unknown) {
      const appwriteError = err as AppwriteException

      if (appwriteError?.code === 429) {
        setError("Demasiados intentos. Espera unos minutos.")
      } else if (appwriteError?.code === 401) {
        setError("Credenciales incorrectas.")
      } else {
        setError(appwriteError?.message ?? "No se pudo iniciar sesion.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-96 rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">Iniciar sesion</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border p-3"
            autoComplete="email"
            required
          />

          <input
            type="password"
            placeholder="Contrasena"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border p-3"
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black p-3 text-white disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </div>
    </div>
  )
}
