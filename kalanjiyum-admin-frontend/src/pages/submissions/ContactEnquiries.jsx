import { useState, useEffect, useCallback } from 'react'
import { Eye, RefreshCw, FileDown } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import DataTable from '../../components/ui/DataTable'
import DetailModal from '../../components/ui/DetailModal'
import { getContactSubmissions, markSubmissionViewed, getViewedSubmissions } from '../../api/submissions'
import { exportCsv } from './exportCsv'
import './Submissions.css'

const fmt = (iso) => iso ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'
const fmtShort = (iso) => {
    if (!iso) return '—'
    const d = new Date(iso)
    const sameYear = d.getFullYear() === new Date().getFullYear()
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + (sameYear ? '' : ` '${String(d.getFullYear()).slice(2)}`)
}

const EXPORT_COLUMNS = [
    { label: 'Date',         value: r => fmt(r.submittedAt) },
    { label: 'Name',         value: r => r.name ?? '' },
    { label: 'Email',        value: r => r.email ?? '' },
    { label: 'Phone',        value: r => r.phone ?? '' },
    { label: 'Organisation', value: r => r.orgName ?? '' },
    { label: 'Address',      value: r => r.address ?? '' },
    { label: 'Message',      value: r => r.message ?? '' },
]

const COLUMNS = [
    { key: '_seen',       label: '',             width: 24,  render: r => <span className={`sub-dot${r.__viewed ? ' sub-dot--seen' : ''}`} /> },
    { key: 'submittedAt', label: 'Date',         width: 160, render: r => fmt(r.submittedAt) },
    { key: 'name',        label: 'Name',         width: 160 },
    { key: 'email',       label: 'Email',        width: 200 },
    { key: 'phone',       label: 'Phone',        width: 130 },
    { key: 'orgName',     label: 'Organisation', width: 160, render: r => r.orgName || '—' },
    { key: 'actions',     label: '',             width: 60,
        render: r => (
            <button className="sub-view-btn" onClick={r.__onView}>
                <Eye size={14} /> View
            </button>
        )
    },
]

function ContactDetail({ row }) {
    return (
        <dl className="sub-detail">
            <div className="sub-detail_row"><dt>Date</dt><dd>{fmt(row.submittedAt)}</dd></div>
            <div className="sub-detail_row"><dt>Name</dt><dd>{row.name}</dd></div>
            <div className="sub-detail_row"><dt>Email</dt><dd><a href={`mailto:${row.email}`}>{row.email}</a></dd></div>
            <div className="sub-detail_row"><dt>Phone</dt><dd>{row.phone || '—'}</dd></div>
            <div className="sub-detail_row"><dt>Organisation</dt><dd>{row.orgName || '—'}</dd></div>
            <div className="sub-detail_row"><dt>Address</dt><dd>{row.address || '—'}</dd></div>
            <div className="sub-detail_row sub-detail_row--full"><dt>Message</dt><dd className="sub-detail_message">{row.message}</dd></div>
        </dl>
    )
}

export default function ContactEnquiries() {
    const [rows, setRows]       = useState([])
    const [page, setPage]       = useState(1)
    const [total, setTotal]     = useState(0)
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState(null)
    const [search, setSearch]     = useState('')
    const [exporting, setExporting] = useState(false)
    const [viewedIds, setViewedIds] = useState(new Set())

    const LIMIT = 20

    const load = useCallback((p) => {
        setLoading(true)
        getContactSubmissions(p, LIMIT)
            .then(data => {
                setRows(data.items ?? data)
                setTotal(data.total ?? data.length)
                setPage(p)
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load(1) }, [load])
    useEffect(() => { getViewedSubmissions().then(d => setViewedIds(new Set(d.contact ?? []))).catch(() => {}) }, [])

    const handleExport = () => {
        setExporting(true)
        getContactSubmissions(1, 9999)
            .then(data => exportCsv(data.items ?? data, EXPORT_COLUMNS, 'contact-enquiries.csv'))
            .catch(() => {})
            .finally(() => setExporting(false))
    }

    const rowsWithAction = rows.map(r => ({
        ...r,
        __viewed: viewedIds.has(r.id),
        __onView: () => {
            markSubmissionViewed('contact', r.id).catch(() => {})
            setViewedIds(prev => new Set([...prev, r.id]))
            setSelected(r)
        }
    }))
    const filtered = rowsWithAction.filter(r => {
        if (!search) return true
        const q = search.toLowerCase()
        return (r.name   ?? '').toLowerCase().includes(q)
            || (r.email  ?? '').toLowerCase().includes(q)
            || (r.orgName ?? '').toLowerCase().includes(q)
    })
    const totalPages = search ? 1 : Math.ceil(total / LIMIT)
    const subtitle = search
        ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`
        : `${total} total submission${total !== 1 ? 's' : ''}`

    return (
        <div className="sub-page">
            <PageHeader
                title="Contact Enquiries"
                subtitle={subtitle}
                action={
                    <div className="sub-toolbar">
                        <input className="sub-search" placeholder="Search name, email…" value={search} onChange={e => setSearch(e.target.value)} />
                        <button className="sub-refresh-btn" onClick={() => load(page)} title="Refresh"><RefreshCw size={14} /></button>
                        <button className="sub-export-btn" onClick={handleExport} disabled={exporting}><FileDown size={14} />{exporting ? 'Exporting…' : 'Export CSV'}</button>
                    </div>
                }
            />
            <DataTable
                columns={COLUMNS}
                rows={filtered}
                page={page}
                totalPages={totalPages}
                onPage={load}
                loading={loading}
                emptyText="No contact enquiries yet."
                mobileCard={r => {
                    const initials = r.name ? r.name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0,2) : '?'
                    const colors = ['#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981','#0ea5e9']
                    const bg = colors[(r.name?.charCodeAt(0) ?? 0) % colors.length]
                    return (
                        <div className="sub-mcard">
                            <div className="sub-mcard_avatar" style={{ background: bg }}>{initials}{!r.__viewed && <span className="sub-mcard_newdot" />}</div>
                            <div className="sub-mcard_body">
                                <span className="sub-mcard_name">{r.name}</span>
                                <span className="sub-mcard_email">{r.email}</span>
                                <div className="sub-mcard_foot">
                                    {r.orgName && <span className="sub-mcard_meta">{r.orgName}</span>}
                                    <span className="sub-mcard_date">{fmtShort(r.submittedAt)}</span>
                                </div>
                            </div>
                            <button className="sub-view-btn" onClick={r.__onView}><Eye size={14}/> View</button>
                        </div>
                    )
                }}
            />
            {selected && (
                <DetailModal title="Contact Enquiry" onClose={() => setSelected(null)}>
                    <ContactDetail row={selected} />
                </DetailModal>
            )}
        </div>
    )
}
