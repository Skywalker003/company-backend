import { NavLink, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard, Mail, Briefcase, GraduationCap,
    Home, Info, Settings, MapPin, Image, ChevronDown,
    LogOut, FolderKanban
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { logout } from '../../api/auth'
import './Sidebar.css'

const NAV = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        to: '/',
        exact: true,
    },
    {
        label: 'Content',
        icon: FolderKanban,
        children: [
            { label: 'Home',        icon: Home,          to: '/content/home' },
            { label: 'About',       icon: Info,          to: '/content/about' },
            { label: 'Services',    icon: Settings,      to: '/content/services' },
            { label: 'Portfolio',   icon: Image,         to: '/content/portfolio' },
            { label: 'Careers',     icon: Briefcase,     to: '/content/careers' },
            { label: 'Internship',  icon: GraduationCap, to: '/content/internship' },
            { label: 'Locations',   icon: MapPin,        to: '/content/locations' },
        ],
    },
    {
        label: 'Submissions',
        icon: Mail,
        children: [
            { label: 'Contact',          icon: Mail,          to: '/submissions/contact' },
            { label: 'Job Applications', icon: Briefcase,     to: '/submissions/jobs' },
            { label: 'Internship',       icon: GraduationCap, to: '/submissions/internship' },
        ],
    },
]

function NavGroup({ item, onClose }) {
    const [open, setOpen] = useState(true)
    const Icon = item.icon
    return (
        <div className="sidebar-group">
            <button className="sidebar-group_toggle" onClick={() => setOpen(o => !o)}>
                <Icon size={16} />
                <span>{item.label}</span>
                <ChevronDown size={14} className={`sidebar-chevron${open ? ' sidebar-chevron--open' : ''}`} />
            </button>
            {open && (
                <div className="sidebar-group_children">
                    {item.children.map(child => {
                        const CIcon = child.icon
                        return (
                            <NavLink
                                key={child.to}
                                to={child.to}
                                className={({ isActive }) =>
                                    `sidebar-link sidebar-link--child${isActive ? ' sidebar-link--active' : ''}`
                                }
                                onClick={onClose}
                            >
                                <CIcon size={14} />
                                <span>{child.label}</span>
                            </NavLink>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default function Sidebar({ open, onClose }) {
    const { signOut, user } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try { await logout() } catch { /* ignore */ }
        signOut()
        navigate('/login', { replace: true })
        onClose?.()
    }

    return (
        <aside className={`sidebar${open ? ' sidebar--open' : ''}`}>
            <div className="sidebar-brand">
                <span className="sidebar-brand_name">Kalanjiyam</span>
                <span className="sidebar-brand_tag">Admin</span>
            </div>

            <nav className="sidebar-nav">
                {NAV.map(item => item.children
                    ? <NavGroup key={item.label} item={item} onClose={onClose} />
                    : (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.exact}
                            className={({ isActive }) =>
                                `sidebar-link${isActive ? ' sidebar-link--active' : ''}`
                            }
                            onClick={onClose}
                        >
                            <item.icon size={16} />
                            <span>{item.label}</span>
                        </NavLink>
                    )
                )}
            </nav>

            <div className="sidebar-footer">
                {user && <p className="sidebar-user">{user.email}</p>}
                <button className="sidebar-logout" onClick={handleLogout}>
                    <LogOut size={14} />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
