import { createContext, useState } from 'react'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('admin_token'))
    const [user,  setUser]  = useState(() => {
        try { return JSON.parse(localStorage.getItem('admin_user')) } catch { return null }
    })

    const signIn = (tok, userData) => {
        localStorage.setItem('admin_token', tok)
        localStorage.setItem('admin_user', JSON.stringify(userData))
        setToken(tok)
        setUser(userData)
    }

    const signOut = () => {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ token, user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}
