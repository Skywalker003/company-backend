import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import { ToastProvider } from './components/ui/Toast'
import AdminLayout from './components/layout/AdminLayout'

const Login                   = lazy(() => import('./pages/Login'))
const Dashboard               = lazy(() => import('./pages/Dashboard'))
const ContactEnquiries        = lazy(() => import('./pages/submissions/ContactEnquiries'))
const JobApplications         = lazy(() => import('./pages/submissions/JobApplications'))
const InternshipApplications  = lazy(() => import('./pages/submissions/InternshipApplications'))
const Home                    = lazy(() => import('./pages/content/Home'))
const About                   = lazy(() => import('./pages/content/About'))
const Services                = lazy(() => import('./pages/content/Services'))
const Portfolio               = lazy(() => import('./pages/content/Portfolio'))
const Careers                 = lazy(() => import('./pages/content/Careers'))
const Internship              = lazy(() => import('./pages/content/Internship'))
const Locations               = lazy(() => import('./pages/content/Locations'))

const PageLoader = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <span>Loading…</span>
    </div>
)

function ProtectedRoute({ children }) {
    const { token } = useAuth()
    return token ? children : <Navigate to="/login" replace />
}

export default function App() {
    return (
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={
                            <ProtectedRoute>
                                <AdminLayout />
                            </ProtectedRoute>
                        }>
                            <Route index element={<Dashboard />} />

                            {/* Submissions */}
                            <Route path="submissions/contact"    element={<ContactEnquiries />} />
                            <Route path="submissions/jobs"       element={<JobApplications />} />
                            <Route path="submissions/internship" element={<InternshipApplications />} />

                            {/* Content */}
                            <Route path="content/home"       element={<Home />} />
                            <Route path="content/about"      element={<About />} />
                            <Route path="content/services"   element={<Services />} />
                            <Route path="content/portfolio"  element={<Portfolio />} />
                            <Route path="content/careers"    element={<Careers />} />
                            <Route path="content/internship" element={<Internship />} />
                            <Route path="content/locations"  element={<Locations />} />
                        </Route>
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
    )
}
