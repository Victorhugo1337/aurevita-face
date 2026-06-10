import { BookOpen } from 'lucide-react'
import { DOCS_URL } from '../lib/config'

export function ApiDocsLink({ className = '', showIcon = true, label = 'Documentação API' }) {
  return (
    <a
      href={DOCS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {showIcon && <BookOpen size={14} />}
      {label}
    </a>
  )
}
