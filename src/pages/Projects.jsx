import { useState } from 'react'
import { ExternalLink, Star, ImageOff } from 'lucide-react'
import { useData } from '../context/DataContext'
import { categories } from '../data/projects'

function ProjectCard({ project }) {
  return (
    <div className="card group flex flex-col h-full p-0 overflow-hidden">
      {/* 썸네일 */}
      <div className="relative w-full aspect-video bg-bg-primary overflow-hidden border-b border-border">
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-bg-secondary to-bg-card">
            <ImageOff size={28} className="text-border" />
            <span className="text-text-muted text-xs">썸네일 없음</span>
          </div>
        )}
        {project.featured && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-amber-300 text-xs font-medium">대표</span>
          </div>
        )}
        {project.year && (
          <span className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-sm text-text-secondary text-xs px-2 py-1 rounded-full">
            {project.year}
          </span>
        )}
      </div>

      {/* 본문 */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-semibold text-white mb-2 group-hover:text-accent transition-colors">
          {project.title}
        </h3>

        <p className="text-text-secondary text-sm leading-relaxed flex-1 mb-4">
          {project.description}
        </p>

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
          </div>
        )}

        <div className="flex items-center pt-3 border-t border-border">
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-text-muted hover:text-accent text-sm transition-colors"
            >
              <ExternalLink size={14} />
              바로가기
            </a>
          ) : (
            <span className="text-text-muted text-xs">링크 없음</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const { data } = useData()
  const { projects } = data
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered =
    activeCategory === 'all' ? projects : projects.filter((p) => p.category === activeCategory)

  return (
    <div className="section-container">
      <h1 className="section-title">Projects</h1>
      <p className="section-subtitle">직접 만든 코딩 결과물</p>
      <div className="divider" />

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all duration-200 ${
              activeCategory === cat.value
                ? 'bg-accent border-accent text-white'
                : 'border-border text-text-secondary hover:border-accent/50 hover:text-white'
            }`}
          >
            {cat.label}
            <span className="ml-1.5 text-xs opacity-60">
              {cat.value === 'all'
                ? projects.length
                : projects.filter((p) => p.category === cat.value).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-text-muted">
          해당 분류의 프로젝트가 없습니다.
        </div>
      )}
    </div>
  )
}
