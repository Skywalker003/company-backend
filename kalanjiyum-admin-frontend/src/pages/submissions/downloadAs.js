export async function downloadAs(url, filename) {
    try {
        const res = await fetch(url)
        if (!res.ok) throw new Error()
        const blob = await res.blob()
        const blobUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000)
    } catch {
        window.open(url, '_blank')
    }
}