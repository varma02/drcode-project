import React, { createContext, useContext, useEffect, useState } from "react"

import { API_URL, defaultTimeout } from "./constants";
import axios from "axios";

async function loginEmailPassword(email: string, password: string, remember: boolean): Promise<any> {
  return (await axios.post(API_URL + "/auth/login", { email, password, remember }, { timeout: defaultTimeout })).data;
}

async function getLoggedInUser(token:string): Promise<any> {
  return (await axios.get(API_URL + "/auth/me", {headers: {Authorization: `Bearer ${token}`}, timeout: defaultTimeout})).data;
}

type AuthState = "loading" | "yes" | "no";

const AuthContext = createContext<{
  user: null | object,
  token: null | string,
  authState: AuthState,
  loginEmailPassword: (email: string, password: string, remember: boolean) => Promise<void>,
  logout: () => Promise<void>,
}>({
  user: null,
  token: null,
  authState: "loading",
  loginEmailPassword: async (email: string, password: string, remember: boolean) => {},
  logout: async () => {},
})

export function AuthProvider({children}) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [authState, setAuthState] = useState<AuthState>("loading")

  useEffect(() => {
    console.debug("Auth loading")
    const localToken = localStorage.getItem("drcode-auth-token")
    if (localToken) {
      getLoggedInUser(localToken).then((response) => {
        if (response) {
          console.debug("User logged in")
          setUser(response.data.employee)
          setToken(localToken)
          setAuthState("yes")
        } else {
          console.warn("Invalid token")
          localStorage.removeItem("drcode-auth-token")
          setAuthState("no")
        }
      }).catch(() => {
        console.warn("Auth error")
        localStorage.removeItem("drcode-auth-token")
        setAuthState("no")
      })
    } else {
      console.debug("No token")
      setAuthState("no")
    }
  }, [])

  const value = {
    user,
    token,
    authState,
    loginEmailPassword: async (email: string, password: string, remember: boolean) => {
      try {
        const response = await loginEmailPassword(email, password, remember)
        if (response.code !== "success") throw response
        const { token, employee } = response.data
        localStorage.setItem("drcode-auth-token", token)
        setUser(employee)
        setToken(token)
        setAuthState("yes")
      } catch (e) {
        value.logout()
        throw e
      }
    },
    logout: async () => {
      localStorage.removeItem("drcode-auth-token")
      setUser(null)
      setToken(null)
      setAuthState("no")
    },
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider")

  return context
}
