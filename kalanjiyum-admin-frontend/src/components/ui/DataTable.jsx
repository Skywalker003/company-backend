import './DataTable.css'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function DataTable({ columns, rows, page, totalPages, onPage, loading, emptyText = 'No records found.', mobileCard }) {
    return (
        <div className="datatable-wrap">
            <div className={`datatable-scroll${mobileCard ? ' datatable-scroll--desktop' : ''}`}>
                <table className="datatable">
                    <thead>
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} style={{ width: col.width }}>{col.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={columns.length} className="datatable-empty">Loading…</td></tr>
                        ) : rows.length === 0 ? (
                            <tr><td colSpan={columns.length} className="datatable-empty">{emptyText}</td></tr>
                        ) : rows.map((row, i) => (
                            <tr key={row.id ?? i}>
                                {columns.map(col => (
                                    <td key={col.key}>
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {mobileCard && (
                <div className="datatable-cards">
                    {loading ? (
                        <div className="datatable-empty">Loading…</div>
                    ) : rows.length === 0 ? (
                        <div className="datatable-empty">{emptyText}</div>
                    ) : rows.map((row, i) => (
                        <div key={row.id ?? i} className="datatable-card">
                            {mobileCard(row)}
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="datatable-pagination">
                    <button
                        className="datatable-page-btn"
                        onClick={() => onPage(page - 1)}
                        disabled={page <= 1}
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <span className="datatable-page-info">Page {page} of {totalPages}</span>
                    <button
                        className="datatable-page-btn"
                        onClick={() => onPage(page + 1)}
                        disabled={page >= totalPages}
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            )}
        </div>
    )
}
