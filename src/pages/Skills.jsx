import { useState } from 'react'
import { Users, Clock, CalendarDays, TrendingUp, BookOpen } from 'lucide-react'
import { useData } from '../context/DataContext'

function CourseCard({ course }) {
  return (
    <div className="card group flex flex-col gap-4">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white text-base group-hover:text-accent transition-colors leading-snug">
          {course.title}
        </h3>
        {course.period && (
          <span className="text-text-muted text-xs shrink-0 mt-0.5">{course.period}</span>
        )}
      </div>

      {/* 메타 정보 */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {course.target && (
          <div className="flex items-center gap-1.5 text-text-secondary text-sm">
            <Users size={13} className="text-accent shrink-0" />
            {course.target}
          </div>
        )}
        {course.duration && (
          <div className="flex items-center gap-1.5 text-text-secondary text-sm">
            <Clock size={13} className="text-accent shrink-0" />
            {course.duration}
          </div>
        )}
      </div>

      {/* 설명 */}
      {course.description && (
        <p className="text-text-secondary text-sm leading-relaxed">{course.description}</p>
      )}

      {/* 성과 */}
      {course.outcome && (
        <div className="flex items-start gap-2 bg-accent/5 border border-accent/15 rounded-lg px-3 py-2">
          <TrendingUp size={14} className="text-accent mt-0.5 shrink-0" />
          <p className="text-text-secondary text-xs leading-relaxed">{course.outcome}</p>
        </div>
      )}

      {/* 태그 */}
      {course.tags && course.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border">
          {course.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Experience() {
  const { data } = useData()
  const courses = data.courses || []

  return (
    <div className="section-container">
      <div className="flex items-end justify-between mb-2">
        <h1 className="section-title">Experience</h1>
        <span className="text-text-muted text-sm mb-1">{courses.length}개 과정</span>
      </div>
      <p className="section-subtitle">기획 & 운영한 교육과정</p>
      <div className="divider" />

      {courses.length === 0 ? (
        <div className="text-center py-24">
          <BookOpen size={40} className="text-text-muted mx-auto mb-4" />
          <p className="text-text-muted">아직 등록된 교육과정이 없습니다.</p>
          <p className="text-text-muted text-sm mt-1">관리자 패널에서 추가해보세요.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
