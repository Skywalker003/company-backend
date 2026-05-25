import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { login } from '../api/auth'
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import logo from '../assets/logo.png'
import './Login.css'

export default function Login() {
    const [email, setEmail]         = useState('')
    const [password, setPassword]   = useState('')
    const [showPass, setShowPass]   = useState(false)
    const [error, setError]         = useState('')
    const [loading, setLoading]     = useState(false)
    const { signIn }  = useAuth()
    const navigate    = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        login(email, password)
            .then(({ token, user }) => {
                signIn(token, user)
                navigate('/', { replace: true })
            })
            .catch(err => {
                setError(err.response?.data?.message ?? 'Invalid credentials. Please try again.')
                setLoading(false)
            })
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-brand">
                    <div className="login-brand_icon">
                        <img src={logo} alt="Kalanjiyam logo" />
                    </div>
                    <span className="login-brand_name">Kalanjiyam</span>
                    <span className="login-brand_tag">Admin</span>
                </div>

                <h1 className="login-title">Sign In</h1>
                <p className="login-sub">Enter your credentials to access the admin console.</p>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="login-field">
                        <label htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            placeholder="admin@kalanjiyam.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="login-password">Password</label>
                        <div className="login-pass-wrap">
                            <input
                                id="login-password"
                                type={showPass ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="login-pass-toggle"
                                onClick={() => setShowPass(v => !v)}
                                tabIndex={-1}
                                aria-label={showPass ? 'Hide password' : 'Show password'}
                            >
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="login-error" role="alert">
                            <AlertCircle size={14} aria-hidden="true" />
                            {error}
                        </div>
                    )}

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading
                            ? <><Loader2 size={15} className="login-spinner" /> Signing in…</>
                            : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    )
}