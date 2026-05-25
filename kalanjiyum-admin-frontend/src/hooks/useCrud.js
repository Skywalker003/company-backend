import { useState, useEffect, useCallback } from 'react'

export function useCrud(fetchFn) {
    const [items, setItems]     = useState([])
    const [loading, setLoading] = useState(false)

    const reload = useCallback(() => {
        setLoading(true)
        fetchFn()
            .then(data => setItems(Array.isArray(data) ? data : []))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [fetchFn])

    useEffect(() => { reload() }, [reload])

    return { items, loading, reload, setItems }
}
