import { GET } from "../api/index"

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
    GET<{ loggedId: boolean; user: User }>("/auth/session", (data, err) => {
      if (data) {
        if (data.loggedId) {
          setAuthContext({
            user: data.user,
            status: AuthStatus.AUTHORIZED,
          })
        }
        if (!data.loggedId) {
          setAuthContext({
            user: null,
            status: AuthStatus.UNAUTHORIZED,
          })
        }
      }
      if (err) {
        setAuthContext({
          user: null,
          status: AuthStatus.UNAUTHORIZED,
        })
      }
    })
  }, [])
  return [authContext, setAuthContext]
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authContext, setAuthContext] = useAuthSession()

  if (authContext.status === AuthStatus.IDLE)
    return (
      <div className="book-container">
        <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
          <div
            style={{
              width: "20%",
              paddingTop: 15,
              borderRight: "1px solid #ebebeb",
            }}
          />
          <div
            style={{
              width: "100%",
              paddingTop: 15,
              paddingLeft: "5%",
              paddingBottom: 50,
            }}
          >
            <div>Loading...</div>
          </div>
        </div>
      </div>
    )

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
