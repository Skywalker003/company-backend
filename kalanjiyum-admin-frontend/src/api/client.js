import axios from 'axios'

const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use(config => {
    const token = localStorage.getItem('admin_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

client.interceptors.response.use(
    r => r,
    err => {
        if (err.response?.status === 401 && window.location.pathname !== '/login') {
            localStorage.removeItem('admin_token')
            window.location.href = '/login'
        }
        return Promise.reject(err)
    }
)

export const get        = (path)        => client.get(path).then(r => r.data)
export const post       = (path, body)  => client.post(path, body).then(r => r.data)
export const put        = (path, body)  => client.put(path, body).then(r => r.data)
export const patch      = (path, body)  => client.patch(path, body).then(r => r.data)
export const del        = (path)        => client.delete(path).then(r => r.data)
export const uploadFile = (path, file)  => {
    const fd = new FormData()
    fd.append('file', file)
    return client.post(path, fd, { headers: { 'Content-Type': undefined } }).then(r => r.data)
}

export default client
