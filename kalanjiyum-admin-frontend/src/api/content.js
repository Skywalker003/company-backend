import { get, post, put, del } from './client'

// ── Home ──────────────────────────────────────────────
export const getHomeStats      = ()        => get('/home/stats')
export const createHomeStat    = (b)       => post('/home/stats', b)
export const updateHomeStat    = (id, b)   => put(`/home/stats/${id}`, b)
export const deleteHomeStat    = (id)      => del(`/home/stats/${id}`)

export const getHomeFeatures   = ()        => get('/home/features')
export const createHomeFeature = (b)       => post('/home/features', b)
export const updateHomeFeature = (id, b)   => put(`/home/features/${id}`, b)
export const deleteHomeFeature = (id)      => del(`/home/features/${id}`)

export const getTestimonials   = ()        => get('/testimonials')
export const createTestimonial = (b)       => post('/testimonials', b)
export const updateTestimonial = (id, b)   => put(`/testimonials/${id}`, b)
export const deleteTestimonial = (id)      => del(`/testimonials/${id}`)

// ── About ─────────────────────────────────────────────
export const getWhoWeAreText     = ()      => get('/about/who-we-are')
export const updateWhoWeAreText  = (b)     => put('/about/who-we-are', b)

export const getMissionVision    = ()      => get('/about/mission-vision')
export const createMissionVision = (b)     => post('/about/mission-vision', b)
export const updateMissionVision = (id, b) => put(`/about/mission-vision/${id}`, b)
export const deleteMissionVision = (id)    => del(`/about/mission-vision/${id}`)

export const getCoreValues       = ()      => get('/about/core-values')
export const createCoreValue     = (b)     => post('/about/core-values', b)
export const updateCoreValue     = (id, b) => put(`/about/core-values/${id}`, b)
export const deleteCoreValue     = (id)    => del(`/about/core-values/${id}`)

export const getGallerySlides    = ()      => get('/about/gallery')
export const createGallerySlide  = (b)     => post('/about/gallery', b)
export const updateGallerySlide  = (id, b) => put(`/about/gallery/${id}`, b)
export const deleteGallerySlide  = (id)    => del(`/about/gallery/${id}`)

// ── Services ──────────────────────────────────────────
export const getServices       = ()        => get('/services')
export const createService     = (b)       => post('/services', b)
export const updateService     = (id, b)   => put(`/services/${id}`, b)
export const deleteService     = (id)      => del(`/services/${id}`)

export const getServiceProcess  = ()       => get('/services/process')
export const createServiceStep  = (b)      => post('/services/process', b)
export const updateServiceStep  = (id, b)  => put(`/services/process/${id}`, b)
export const deleteServiceStep  = (id)     => del(`/services/process/${id}`)

// ── Portfolio ─────────────────────────────────────────
export const getPortfolioTopics  = ()      => get('/portfolio/topics')
export const createPortfolioTopic= (b)     => post('/portfolio/topics', b)
export const updatePortfolioTopic= (id, b) => put(`/portfolio/topics/${id}`, b)
export const deletePortfolioTopic= (id)    => del(`/portfolio/topics/${id}`)

export const getPortfolioItems   = ()      => get('/portfolio/items')
export const createPortfolioItem = (b)     => post('/portfolio/items', b)
export const updatePortfolioItem = (id, b) => put(`/portfolio/items/${id}`, b)
export const deletePortfolioItem = (id)    => del(`/portfolio/items/${id}`)

// ── Careers ───────────────────────────────────────────
export const getJobs          = ()         => get('/careers/jobs')
export const createJob        = (b)        => post('/careers/jobs', b)
export const updateJob        = (id, b)    => put(`/careers/jobs/${id}`, b)
export const deleteJob        = (id)       => del(`/careers/jobs/${id}`)

export const getCareersReasons  = ()       => get('/careers/reasons')
export const createCareersReason= (b)      => post('/careers/reasons', b)
export const updateCareersReason= (id, b)  => put(`/careers/reasons/${id}`, b)
export const deleteCareersReason= (id)     => del(`/careers/reasons/${id}`)

// ── Internship ────────────────────────────────────────
export const getInternDomains    = ()      => get('/internship/domains')
export const createInternDomain  = (b)     => post('/internship/domains', b)
export const updateInternDomain  = (id, b) => put(`/internship/domains/${id}`, b)
export const deleteInternDomain  = (id)    => del(`/internship/domains/${id}`)

export const getInternReasons    = ()      => get('/internship/reasons')
export const createInternReason  = (b)     => post('/internship/reasons', b)
export const updateInternReason  = (id, b) => put(`/internship/reasons/${id}`, b)
export const deleteInternReason  = (id)    => del(`/internship/reasons/${id}`)

export const getInternBenefits   = ()      => get('/internship/benefits')
export const createInternBenefit = (b)     => post('/internship/benefits', b)
export const updateInternBenefit = (id, b) => put(`/internship/benefits/${id}`, b)
export const deleteInternBenefit = (id)    => del(`/internship/benefits/${id}`)

export const getInternSteps      = ()      => get('/internship/steps')
export const createInternStep    = (b)     => post('/internship/steps', b)
export const updateInternStep    = (id, b) => put(`/internship/steps/${id}`, b)
export const deleteInternStep    = (id)    => del(`/internship/steps/${id}`)

export const getEligibilityCards  = ()     => get('/internship/eligibility')
export const createEligibilityCard= (b)    => post('/internship/eligibility', b)
export const updateEligibilityCard= (id,b) => put(`/internship/eligibility/${id}`, b)
export const deleteEligibilityCard= (id)   => del(`/internship/eligibility/${id}`)

export const getInternFAQs       = ()      => get('/internship/faqs')
export const createInternFAQ     = (b)     => post('/internship/faqs', b)
export const updateInternFAQ     = (id, b) => put(`/internship/faqs/${id}`, b)
export const deleteInternFAQ     = (id)    => del(`/internship/faqs/${id}`)

// ── Locations ─────────────────────────────────────────
export const getLocations        = ()      => get('/locations')
export const createLocation      = (b)     => post('/locations', b)
export const updateLocation      = (id, b) => put(`/locations/${id}`, b)
export const deleteLocation      = (id)    => del(`/locations/${id}`)

export const getFooterContact    = ()      => get('/locations/footer-contact')
export const updateFooterContact = (b)     => put('/locations/footer-contact', b)

export const getHeadquarters     = ()      => get('/locations/headquarters')
export const updateHeadquarters  = (b)     => put('/locations/headquarters', b)
