import { get, post } from './client'

export const getContactSubmissions     = (page = 1, limit = 20) => get(`/submissions/contact?page=${page}&limit=${limit}`)
export const getJobSubmissions         = (page = 1, limit = 20) => get(`/submissions/jobs?page=${page}&limit=${limit}`)
export const getInternshipSubmissions  = (page = 1, limit = 20) => get(`/submissions/internship?page=${page}&limit=${limit}`)
export const getViewedSubmissions      = () => get('/submissions/viewed')
export const markSubmissionViewed      = (type, id) => post('/submissions/view', { type, id })
