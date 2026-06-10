const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const DOCS_URL =
  import.meta.env.VITE_DOCS_URL || `${API_URL.replace(/\/$/, '')}/swagger-ui.html`
