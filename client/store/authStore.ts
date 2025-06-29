import { create } from 'zustand'
import { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  login: (user: User, token: string) => {
    set({ user, token, isAuthenticated: true })
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  },
  
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false })
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  
  updateUser: (userData: Partial<User>) => {
    const currentUser = get().user
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData }
      set({ user: updatedUser })
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  },
}))

// Initialize auth state from localStorage
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr)
      useAuthStore.setState({ user, token, isAuthenticated: true })
    } catch (error) {
      console.error('Error parsing user from localStorage:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
}
