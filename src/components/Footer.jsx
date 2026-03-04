import { Mail, Linkedin, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'

export default function Footer() {
  const { data } = useData()
  const { profile } = data

  return (
    <footer className="border-t border-border bg-bg-primary">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-text-muted text-sm">
          © 2025 {profile.name}.
        </p>
        <div className="flex items-center gap-4">
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="text-text-muted hover:text-white transition-colors" aria-label="Email">
              <Mail size={18} />
            </a>
          )}
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-white transition-colors" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
          )}
          <Link to="/admin" className="text-text-muted hover:text-accent transition-colors" aria-label="관리자" title="관리자 패널">
            <Lock size={15} />
          </Link>
        </div>
      </div>
    </footer>
  )
}
