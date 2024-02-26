'use client'

import { useRouter } from "next/navigation"
import { useAuth } from "providers/AuthContext"
import { use, useEffect } from "react"

export default function AuthProtected({ children }) {
  const {currentUser, isLoading} = useAuth()
  const router = useRouter()
  
  if (isLoading) {
    return null
  }

  useEffect(() => {
    if (!currentUser) {
      router.push('/welcome')
    }
  }, [isLoading, currentUser])

  return (
    currentUser && (<div className="flex flex-col grow items-center py-4">
        {children}
      </div>
    )
  )
}