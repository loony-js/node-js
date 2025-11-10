import { getUserInfo } from "../api/index"

import React, { useEffect, useState } from "react"

interface User {
  fname: string
  lname: string
  email: string
  uid: number
}

interface Auth {
  status: AuthStatus
  user: User | undefined | null
}

export enum AuthStatus {
  IDLE = 1,
  UNAUTHORIZED = 2,
  AUTHORIZED = 3,
}

const authState: Auth = {
  status: AuthStatus.IDLE,
  user: null,
}

interface AuthContextProps extends Auth {
  setAuthContext: React.Dispatch<React.SetStateAction<Auth>>
}

export const AuthContext = React.createContext<AuthContextProps>({
  ...authState,
  setAuthContext: () => {
    return
  },
})

const useAuthSession = (): [
  Auth,
  React.Dispatch<React.SetStateAction<Auth>>,
] => {
  const [authContext, setAuthContext] = useState(authState)

  useEffect(() => {
    getUserInfo()
      .then(({ data }: any) => {
        setAuthContext({
          user: data,
          status: AuthStatus.AUTHORIZED,
        })
      })
      .catch(() => {
        console.log("Errosjfjdslfjsdll")
        setAuthContext({
          user: null,
          status: AuthStatus.UNAUTHORIZED,
        })
      })
  }, [])
  return [authContext, setAuthContext]
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authContext, setAuthContext] = useAuthSession()

  if (authContext.status === AuthStatus.IDLE) return null
  return (
    <AuthContext.Provider
      value={{
        ...authContext,
        setAuthContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
