import { MapPin, Calendar, Briefcase, GraduationCap } from 'lucide-react'
import { useData } from '../context/DataContext'

function TimelineItem({ item, type, isLast }) {
  const DefaultIcon = type === 'experience' ? Briefcase : GraduationCap

  return (
    <div className="relative flex gap-5 group">
      {/* 왼쪽: 이미지 or 아이콘 + 연결선 */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-12 h-12 rounded-xl overflow-hidden border border-border bg-bg-card flex items-center justify-center shrink-0">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.company || item.school} className="w-full h-full object-contain p-1" />
          ) : (
            <DefaultIcon size={20} className="text-text-muted" />
          )}
        </div>
        {!isLast && <div className="w-px flex-1 bg-border mt-2 mb-0" />}
      </div>

      {/* 오른쪽: 내용 */}
      <div className="pb-8 min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-semibold text-white">{item.role || item.degree}</h3>
          <span className="text-accent text-sm font-medium">@ {item.company || item.school}</span>
        </div>
        <div className="flex items-center gap-1.5 text-text-muted text-sm mb-2">
          <Calendar size={13} />
          {item.period}
          {item.major && <span className="ml-2 text-text-secondary">· {item.major}</span>}
        </div>
        {item.description && (
          <p className="text-text-secondary text-sm leading-relaxed mb-3">{item.description}</p>
        )}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
          </div>
        )}
      </div>
    </div>
  )
}

export default function About() {
  const { data } = useData()
  const { profile, experience, education } = data

  return (
    <div className="section-container">
      {/* 프로필 */}
      <div className="mb-16">
        <h1 className="section-title">About</h1>
        <div className="divider" />

        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1">
            {profile.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={profile.name}
                className="w-40 h-40 rounded-2xl object-cover border border-border"
              />
            ) : (
              <div className="w-40 h-40 rounded-2xl bg-bg-card border border-border flex items-center justify-center text-6xl">
                👤
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-1">{profile.name}</h2>
            <p className="text-accent font-medium mb-4">{profile.title}</p>
            {profile.location && (
              <div className="flex items-center gap-1.5 text-text-muted text-sm mb-5">
                <MapPin size={14} />
                {profile.location}
              </div>
            )}
            <p className="text-text-secondary leading-relaxed whitespace-pre-line">{profile.bio}</p>
          </div>
        </div>
      </div>

      {/* 경력 */}
      {experience.length > 0 && (
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-8">
            <Briefcase size={20} className="text-accent" />
            <h2 className="text-xl font-semibold text-white">경력</h2>
          </div>
          {experience.map((item, i) => (
            <TimelineItem key={item.id} item={item} type="experience" isLast={i === experience.length - 1} />
          ))}
        </div>
      )}

      {/* 학력 */}
      {education.length > 0 && (
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap size={20} className="text-accent" />
            <h2 className="text-xl font-semibold text-white">학력</h2>
          </div>
          {education.map((item, i) => (
            <TimelineItem key={item.id} item={item} type="education" isLast={i === education.length - 1} />
          ))}
        </div>
      )}
    </div>
  )
}
