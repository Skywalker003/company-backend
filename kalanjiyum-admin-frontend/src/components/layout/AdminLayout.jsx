import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import './AdminLayout.css'

export default function AdminLayout() {
    const [open, setOpen] = useState(false)
    const close = () => setOpen(false)

    return (
        <div className="admin-layout">
            <Sidebar open={open} onClose={close} />
            {open && <div className="admin-overlay" onClick={close} />}
            <main className="admin-main">
                <div className="admin-topbar">
                    <button
                        className="admin-topbar_hamburger"
                        onClick={() => setOpen(o => !o)}
                        aria-label="Toggle menu"
                        aria-expanded={open}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                    <span className="admin-topbar_brand">
                        Kalanjiyam <span className="admin-topbar_tag">Admin</span>
                    </span>
                </div>
                <Outlet />
            </main>
        </div>
    )
}
