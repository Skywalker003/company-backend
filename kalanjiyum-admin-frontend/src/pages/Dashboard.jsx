import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Mail, Briefcase, GraduationCap,
    Home, Info, Settings, MapPin, Image, FolderKanban, Clock
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import { getContactSubmissions, getJobSubmissions, getInternshipSubmissions, getViewedSubmissions } from '../api/submissions'
import './Dashboard.css'

const SUBMISSIONS = [
    { label: 'Contact Enquiries',       icon: Mail,           to: '/submissions/contact',    color: '#3b82f6', countKey: 'contact' },
    { label: 'Job Applications',        icon: Briefcase,      to: '/submissions/jobs',        color: '#8b5cf6', countKey: 'jobs' },
    { label: 'Internship Applications', icon: GraduationCap,  to: '/submissions/internship',  color: '#10b981', countKey: 'intern' },
]

const CONTENT = [
    { label: 'Home',       icon: Home,           to: '/content/home',       color: '#f59e0b' },
    { label: 'About',      icon: Info,           to: '/content/about',      color: '#06b6d4' },
    { label: 'Services',   icon: Settings,       to: '/content/services',   color: '#8b5cf6' },
    { label: 'Portfolio',  icon: Image,          to: '/content/portfolio',  color: '#ec4899' },
    { label: 'Careers',    icon: Briefcase,      to: '/content/careers',    color: '#f97316' },
    { label: 'Internship', icon: GraduationCap,  to: '/content/internship', color: '#10b981' },
    { label: 'Locations',  icon: MapPin,         to: '/content/locations',  color: '#3b82f6' },
]

const fmtDate = iso => iso ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'


function SectionCard({ icon: Icon, label, to, color, unread }) {
    return (
        <Link to={to} className="dash-card">
            <span className="dash-card_icon" style={{ background: `${color}18`, color }}>
                <Icon size={20} />
            </span>
            <span className="dash-card_label">{label}</span>
            {unread != null && <span className="dash-card_notif">{unread}</span>}
        </Link>
    )
}

export default function Dashboard() {
    const [counts, setCounts]       = useState({ contact: null, jobs: null, intern: null })
    const [viewed, setViewed]       = useState({ contact: [], jobs: [], intern: [] })
    const [recentSubs, setRecentSubs] = useState([])

    useEffect(() => {
        getViewedSubmissions().then(setViewed).catch(() => {})

        getContactSubmissions(1, 5)
            .then(d => {
                setCounts(c => ({ ...c, contact: d.total ?? null }))
                const items = (d.items ?? []).map(r => ({ name: r.name, type: 'Contact', date: r.submittedAt, to: '/submissions/contact' }))
                setRecentSubs(prev => [...prev, ...items])
            }).catch(() => {})

        getJobSubmissions(1, 5)
            .then(d => {
                setCounts(c => ({ ...c, jobs: d.total ?? null }))
                const items = (d.items ?? []).map(r => ({ name: [r.firstName, r.lastName].filter(Boolean).join(' ') || r.email, type: 'Job', date: r.submittedAt, to: '/submissions/jobs' }))
                setRecentSubs(prev => [...prev, ...items])
            }).catch(() => {})

        getInternshipSubmissions(1, 5)
            .then(d => {
                setCounts(c => ({ ...c, intern: d.total ?? null }))
                const items = (d.items ?? []).map(r => ({ name: r.fullName || r.email, type: 'Internship', date: r.submittedAt, to: '/submissions/internship' }))
                setRecentSubs(prev => [...prev, ...items])
            }).catch(() => {})
    }, [])

    const sortedRecent = [...recentSubs]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 8)

    return (
        <div className="dash-page">
            <PageHeader
                title="Dashboard"
                subtitle="Overview of site content and incoming submissions."
            />

            <section className="dash-section">
                <h2 className="dash-section_title">
                    <Mail size={15} />
                    Submissions
                </h2>
                <div className="dash-grid dash-grid--3">
                    {SUBMISSIONS.map(s => {
                        const total = counts[s.countKey]
                        const viewedIds = viewed[s.countKey] ?? []
                        const n = total != null ? Math.max(0, total - viewedIds.length) : 0
                        return (
                            <SectionCard
                                key={s.to}
                                {...s}
                                unread={n > 0 ? n : null}
                            />
                        )
                    })}
                </div>
            </section>

            <section className="dash-section">
                <h2 className="dash-section_title">
                    <FolderKanban size={15} />
                    Content Management
                </h2>
                <div className="dash-grid dash-grid--4">
                    {CONTENT.map(s => (
                        <SectionCard key={s.to} {...s} />
                    ))}
                </div>
            </section>

            {sortedRecent.length > 0 && (
                <section className="dash-section">
                    <h2 className="dash-section_title">
                        <Clock size={15} />
                        Recent Submissions
                    </h2>
                    <div className="dash-recent">
                        {sortedRecent.map((r, i) => (
                            <Link key={i} to={r.to} className="dash-recent_row">
                                <span className={`dash-recent_type dash-recent_type--${r.type.toLowerCase()}`}>{r.type}</span>
                                <span className="dash-recent_name">{r.name}</span>
                                <span className="dash-recent_date">{fmtDate(r.date)}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}