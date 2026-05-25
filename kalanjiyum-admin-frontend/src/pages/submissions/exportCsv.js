function escape(val) {
    if (val == null) return ''
    const s = String(val)
    return (s.includes(',') || s.includes('"') || s.includes('\n'))
        ? `"${s.replace(/"/g, '""')}"`
        : s
}

export function exportCsv(rows, columns, filename) {
    const header = columns.map(c => escape(c.label)).join(',')
    const body   = rows.map(r => columns.map(c => escape(c.value(r))).join(',')).join('\n')
    const blob   = new Blob([`﻿${header}\n${body}`], { type: 'text/csv;charset=utf-8;' })
    const url    = URL.createObjectURL(blob)
    const a      = document.createElement('a')
    a.href = url; a.download = filename
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 10000)
}