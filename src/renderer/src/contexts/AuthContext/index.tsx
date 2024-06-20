import { createContext, useContext, useEffect, useState } from 'react'

type User = Record<string, any>
interface AuthContextType {
  currentUser: User | null
  userLoggedIn: boolean
}

// @ts-ignore
const AuthContext: React.Context<AuthContextType | undefined> = createContext(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    const handleSuccess = (user: User) => {
      setCurrentUser(user)
      setUserLoggedIn(true)
    }
    api.on('auth:googleSuccess', handleSuccess)
    return () => {
      api.off('auth:googleSuccess')
    }
  }, [])

  const value: AuthContextType = {
    currentUser,
    userLoggedIn,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
