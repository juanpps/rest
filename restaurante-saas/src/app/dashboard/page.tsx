"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Models } from "appwrite"
import { account } from "@/lib/appwrite"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await account.get()
        setUser(data)
      } catch {
        router.replace("/login")
      }
    }

    getUser()
  }, [router])

  const handleLogout = async () => {
    await account.deleteSession("current")
    router.replace("/login")
  }

  if (!user) return <div>Cargando...</div>

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">
        Bienvenido {user.email}
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Cerrar sesión
      </button>
    </div>
  )
}

