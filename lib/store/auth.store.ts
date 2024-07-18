import { StateCreator, create } from "zustand"
// Remova a importação do AuthService não utilizado
import { devtools, persist } from "zustand/middleware"
import { toast } from "sonner"
// Importe o cliente Supabase configurado
import { supabase } from "../../supabaseClient"

export interface AuthState {
  status: AuthStatus
  token?: string
  user?: User

  loginUser: (email: string, password: string) => Promise<void>
  logoutUser: () => void
  registerUser: (data: RegisterUser) => Promise<void>
}

const storeApi: StateCreator<AuthState> = (set) => ({
  status: "unauthorized",
  token: undefined,
  user: undefined,
  loginUser: async (email: string, password: string) => {
    try {
      const { error, session, user } = await supabase.auth.signIn({ email, password })
      if (error) throw error
      set({ status: "authorized", token: session.access_token, user })
    } catch (error) {
      set({ status: "unauthorized", token: undefined, user: undefined })
      toast.error("Credenciales incorrectas")
    }
  },
  logoutUser: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error("Erro ao sair")
    }
    set({ status: "unauthorized", token: undefined, user: undefined })
  },
  registerUser: async (data: RegisterUser) => {
    try {
      const { error } = await supabase.auth.signUp({ email: data.email, password: data.password })
      if (error) throw error
    } catch (error) {
      throw new Error(`${error.message}`)
    }
  },
})

export const useAuthStore = create<AuthState>()(devtools(persist(storeApi, { name: "auth-storage" })))