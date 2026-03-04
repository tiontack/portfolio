import { useState } from 'react'
import { Mail, Linkedin, Send, MessageCircle } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function Contact() {
  const { data } = useData()
  const { profile } = data
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const contactLinks = [
    profile.email && {
      icon: Mail, label: '이메일', value: profile.email,
      href: `mailto:${profile.email}`, color: '#6366f1',
    },
    profile.linkedin && {
      icon: Linkedin, label: 'LinkedIn', value: profile.linkedin.replace('https://', ''),
      href: profile.linkedin, color: '#0ea5e9',
    },
  ].filter(Boolean)

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const mailto = `mailto:${profile.email}?subject=포트폴리오 문의 - ${form.name}&body=${encodeURIComponent(
      `이름: ${form.name}\n이메일: ${form.email}\n\n${form.message}`
    )}`
    window.location.href = mailto
    setSent(true)
  }

  return (
    <div className="section-container">
      <h1 className="section-title">Contact</h1>
      <p className="section-subtitle">언제든 연락주세요!</p>
      <div className="divider" />

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle size={18} className="text-accent" />
            <h2 className="font-semibold text-white">연락 방법</h2>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            {contactLinks.map(({ icon: Icon, label, value, href, color }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="card flex items-center gap-4 no-underline group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <p className="text-xs text-text-muted">{label}</p>
                  <p className="text-white text-sm font-medium group-hover:text-accent transition-colors break-all">{value}</p>
                </div>
              </a>
            ))}
          </div>

          <p className="text-text-muted text-sm leading-relaxed">
            협업 제안, 강의 요청, 또는 궁금한 점이 있으시면<br />
            편하게 연락주세요. 24시간 내에 답변 드립니다.
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6">
            <Send size={18} className="text-accent" />
            <h2 className="font-semibold text-white">메시지 보내기</h2>
          </div>

          {sent ? (
            <div className="card text-center py-12">
              <div className="text-4xl mb-3">✉️</div>
              <p className="text-white font-medium mb-1">메일 앱이 열렸습니다</p>
              <p className="text-text-muted text-sm">메일을 발송해주세요.</p>
              <button className="mt-6 text-accent text-sm hover:text-accent-hover" onClick={() => setSent(false)}>
                다시 작성하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {[
                { name: 'name', label: '이름', type: 'text', placeholder: '홍길동' },
                { name: 'email', label: '이메일', type: 'email', placeholder: 'example@email.com' },
              ].map(({ name, label, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-text-secondary text-sm mb-1.5">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    required
                    placeholder={placeholder}
                    className="w-full bg-bg-card border border-border rounded-lg px-4 py-2.5 text-white placeholder:text-text-muted text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-text-secondary text-sm mb-1.5">메시지</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="안녕하세요! ..."
                  className="w-full bg-bg-card border border-border rounded-lg px-4 py-2.5 text-white placeholder:text-text-muted text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>
              <button type="submit" className="btn-primary justify-center">
                <Send size={15} /> 메시지 보내기
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
