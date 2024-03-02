'use client'

import { useRouter } from "next/navigation"
import { useAuth } from "providers/AuthContext"
import { useEffect } from "react"

export default function AuthProtected({ children }) {
  const {currentUser, isLoading} = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push('/welcome')
    }
  }, [isLoading, currentUser, router])
  
  if (isLoading) {
    return null
  }


  return (
    currentUser && (
      <>
        {children}
      </>
    )
  )
}