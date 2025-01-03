import React, { createContext, useContext, useEffect, useState } from "react"

import { ErrorResponse, LoginResponse, MeResponse } from "./models";
import { API_URL } from "./constants";
import axios from "axios";

async function loginEmailPassword(email: string, password: string, remember: boolean): Promise<LoginResponse | ErrorResponse> {
  return (await axios.post(API_URL + "/auth/login", { email, password, remember }, { timeout: 2000 })).data;
}

async function getLoggedInUser(token:string): Promise<MeResponse | ErrorResponse> {
  return (await axios.get(API_URL + "/auth/me", {headers: {Authorization: `Bearer ${token}`}, timeout: 2000})).data;
}

type AuthState = "loading" | "yes" | "no";

const AuthContext = createContext<{
  user: null | MeResponse["data"]["employee"],
  token: null | string,
  authState: AuthState,
  loginEmailPassword: (email: string, password: string, remember: boolean) => Promise<void>,
  logout: () => Promise<void>,

  //TODO: REMOVE THIS
  bypassLogin: () => void,
}>({
  user: null,
  token: null,
  authState: "loading",
  loginEmailPassword: async (email: string, password: string, remember: boolean) => {},
  logout: async () => {},

  //TODO: REMOVE THIS
  bypassLogin: () => {},
})

export function getTopRole(roles: string[] | Set<string>): string {
  roles = new Set(roles)
  if (roles.has("administrator")) return "Admin"
  if (roles.has("teacher")) return "Tanár"
  return "Unknown Role"
}

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
          setUser((response as MeResponse).data.employee)
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
        const { token, employee } = (response as LoginResponse).data
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

    // TODO: REMOVE THIS
    bypassLogin: () => {
      setUser({
        id: "employee:bypassed",
        created: new Date(),
        name: "Bypassed User",
        email: "bypassed@example.com",
        roles: ["teacher", "administrator"],
      })
      setToken("bypassed")
      setAuthState("yes")
    }
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
