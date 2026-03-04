import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Users } from 'lucide-react'
import { useData } from '../context/DataContext'

function useTypingEffect(words, typingSpeed = 100, deletingSpeed = 60, pauseMs = 1800) {
  const [displayed, setDisplayed] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!words || words.length === 0) return
    const current = words[wordIndex % words.length]
    let timeout

    if (!isDeleting && displayed === current) {
      timeout = setTimeout(() => setIsDeleting(true), pauseMs)
    } else if (isDeleting && displayed === '') {
      setIsDeleting(false)
      setWordIndex((i) => (i + 1) % words.length)
    } else {
      timeout = setTimeout(
        () => setDisplayed((prev) => isDeleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1)),
        isDeleting ? deletingSpeed : typingSpeed
      )
    }
    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseMs])

  return displayed
}

export default function Home() {
  const { data } = useData()
  const { profile } = data
  const typed = useTypingEffect(profile.roles || [])

  return (
    <section className="relative min-h-[calc(100vh-64px)] grid-bg flex items-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative w-full">
        <div className="max-w-2xl animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-medium mb-8">
            <Users size={14} />
            사람과 조직의 성장을 만들어갑니다
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            {profile.name}
          </h1>

          <div className="text-2xl md:text-3xl font-medium text-text-secondary mb-6 h-10">
            <span className="text-accent">{typed}</span>
            <span className="animate-blink text-accent">|</span>
          </div>

          <p className="text-text-secondary text-lg leading-relaxed mb-10 max-w-xl">
            교육 기획부터 조직 개발까지,<br />
            사람 중심의 HRD를 실천합니다.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/projects" className="btn-primary">
              주요 성과 보기
              <ArrowRight size={16} />
            </Link>
            <Link to="/about" className="btn-outline">
              소개 보기
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-text-muted text-xs animate-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-border" />
          <span>scroll</span>
        </div>
      </div>
    </section>
  )
}
