import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Lock, LogOut, User, Briefcase, GraduationCap,
  FolderKanban, BookOpen, Settings, Plus, Pencil, Trash2,
  Save, X, ChevronDown, ChevronUp, RotateCcw, Eye,
} from 'lucide-react'
import { useData, DEFAULT_PASSWORD } from '../context/DataContext'
import { categories } from '../data/projects'

// ─── 공통 스타일 ─────────────────────────────────────────────────
const inp = 'w-full bg-bg-primary border border-border rounded-lg px-3 py-2 text-white placeholder:text-text-muted text-sm focus:outline-none focus:border-accent transition-colors'
const lbl = 'block text-text-secondary text-xs mb-1 font-medium'

// ─── 비밀번호 게이트 ─────────────────────────────────────────────
function PasswordGate({ onAuth }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  const { checkPassword } = useData()

  const submit = (e) => {
    e.preventDefault()
    if (checkPassword(pw)) {
      sessionStorage.setItem('admin_ok', '1')
      onAuth()
    } else {
      setErr(true)
      setPw('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary grid-bg">
      <form onSubmit={submit} className="w-full max-w-sm">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Lock size={18} className="text-accent" />
            </div>
            <div>
              <h1 className="text-white font-semibold">관리자 로그인</h1>
              <p className="text-text-muted text-xs">포트폴리오 관리 페이지</p>
            </div>
          </div>
          <label className={lbl}>비밀번호</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setErr(false) }}
            className={inp}
            placeholder="비밀번호 입력"
            autoFocus
          />
          {err && <p className="text-red-400 text-xs mt-1.5">비밀번호가 올바르지 않습니다.</p>}
          <button type="submit" className="btn-primary w-full justify-center mt-4">로그인</button>
          <p className="text-text-muted text-xs text-center mt-3">
            기본 비밀번호: <span className="text-text-secondary font-mono">{DEFAULT_PASSWORD}</span>
          </p>
        </div>
      </form>
    </div>
  )
}

// ─── 삭제 확인 ───────────────────────────────────────────────────
function DeleteConfirm({ label, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="card w-full max-w-sm">
        <h3 className="font-semibold text-white mb-2">정말 삭제할까요?</h3>
        <p className="text-text-secondary text-sm mb-5">
          <span className="text-white">"{label}"</span> 항목이 영구적으로 삭제됩니다.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-outline flex-1 justify-center">취소</button>
          <button onClick={onConfirm} className="flex-1 justify-center px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
            <Trash2 size={14} /> 삭제
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── 모달 ────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── 필드 렌더러 ─────────────────────────────────────────────────
function Field({ field, value, onChange }) {
  if (field.type === 'textarea') return (
    <div>
      <label className={lbl}>{field.label}{field.required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <textarea value={value || ''} onChange={(e) => onChange(field.key, e.target.value)} rows={3} className={inp + ' resize-none'} placeholder={field.placeholder || ''} required={field.required} />
    </div>
  )
  if (field.type === 'tags') return (
    <div>
      <label className={lbl}>{field.label}</label>
      <input type="text" value={value || ''} onChange={(e) => onChange(field.key, e.target.value)} className={inp} placeholder={field.placeholder || '쉼표(,)로 구분'} />
      <p className="text-text-muted text-xs mt-1">쉼표(,)로 구분하여 입력</p>
    </div>
  )
  if (field.type === 'select') return (
    <div>
      <label className={lbl}>{field.label}</label>
      <select value={value || ''} onChange={(e) => onChange(field.key, e.target.value)} className={inp + ' cursor-pointer'}>
        {field.options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  )
  if (field.type === 'checkbox') return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={!!value} onChange={(e) => onChange(field.key, e.target.checked)} className="w-4 h-4 accent-accent" />
      <span className="text-text-secondary text-sm">{field.label}</span>
    </label>
  )
  return (
    <div>
      <label className={lbl}>{field.label}{field.required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <input type={field.type || 'text'} value={value || ''} onChange={(e) => onChange(field.key, e.target.value)} className={inp} placeholder={field.placeholder || ''} required={field.required} />
    </div>
  )
}

// ─── 섹션별 필드 정의 ────────────────────────────────────────────
const SECTION_FIELDS = {
  experience: [
    { key: 'company', label: '회사명', required: true },
    { key: 'role', label: '직책/직무', required: true },
    { key: 'period', label: '기간', placeholder: '2022.01 - 현재', required: true },
    { key: 'imageUrl', label: '회사 로고 이미지 URL', placeholder: 'https://... (선택)' },
    { key: 'description', label: '주요 업무 및 성과', type: 'textarea' },
    { key: 'tags', label: '키워드 태그', type: 'tags', placeholder: '교육 기획, 역량 개발' },
  ],
  education: [
    { key: 'school', label: '학교명', required: true },
    { key: 'major', label: '전공', required: true },
    { key: 'degree', label: '학위', placeholder: '학사 / 석사 / 박사', required: true },
    { key: 'period', label: '재학 기간', placeholder: '2015 - 2019', required: true },
    { key: 'imageUrl', label: '학교 로고 이미지 URL', placeholder: 'https://... (선택)' },
  ],
  projects: [
    { key: 'title', label: '프로젝트명', required: true },
    { key: 'thumbnailUrl', label: '썸네일 이미지 URL', placeholder: 'https://... (스크린샷 URL 입력)' },
    { key: 'description', label: '설명', type: 'textarea', required: true },
    { key: 'category', label: '분류', type: 'select', options: categories.filter(c => c.value !== 'all') },
    { key: 'year', label: '연도', placeholder: '2024', required: true },
    { key: 'tags', label: '기술 태그', type: 'tags', placeholder: 'React, Node.js' },
    { key: 'link', label: '링크 (선택)', placeholder: 'https://...' },
    { key: 'featured', label: '대표 프로젝트로 표시', type: 'checkbox' },
  ],
  courses: [
    { key: 'title', label: '과정명', required: true },
    { key: 'target', label: '교육 대상', placeholder: '신입사원, 중간관리자 등', required: true },
    { key: 'duration', label: '교육 시간', placeholder: '16H / 2일' },
    { key: 'period', label: '운영 시기', placeholder: '2023.03, 연 2회' },
    { key: 'description', label: '과정 소개', type: 'textarea' },
    { key: 'outcome', label: '성과/결과', placeholder: '참여자 만족도 4.5/5.0' },
    { key: 'tags', label: '키워드', type: 'tags', placeholder: '온보딩, 집합교육, 워크숍' },
  ],
}

const tagsToStr = (tags) => (Array.isArray(tags) ? tags.join(', ') : tags || '')
const strToTags = (str) => str ? str.split(',').map((t) => t.trim()).filter(Boolean) : []

function formToItem(formData, sectionFields) {
  const result = { ...formData }
  sectionFields.forEach((f) => { if (f.type === 'tags') result[f.key] = strToTags(formData[f.key]) })
  return result
}
function itemToForm(item, sectionFields) {
  const result = { ...item }
  sectionFields.forEach((f) => { if (f.type === 'tags') result[f.key] = tagsToStr(item[f.key]) })
  return result
}

// ─── 목록 편집 섹션 ──────────────────────────────────────────────
function ListSection({ section, label, items, fields, getItemLabel, getItemMeta }) {
  const { addItem, updateItem, deleteItem } = useData()
  const [modal, setModal] = useState(null)
  const [formData, setFormData] = useState({})
  const [deleting, setDeleting] = useState(null)

  const openAdd = () => { setFormData({}); setModal({ mode: 'add' }) }
  const openEdit = (item) => { setFormData(itemToForm(item, fields)); setModal({ mode: 'edit', item }) }
  const closeModal = () => { setModal(null); setFormData({}) }
  const setField = (key, val) => setFormData((p) => ({ ...p, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const prepared = formToItem(formData, fields)
    if (modal.mode === 'add') addItem(section, prepared)
    else updateItem(section, modal.item.id, prepared)
    closeModal()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-text-secondary text-sm">{items.length}개 항목</span>
        <button onClick={openAdd} className="btn-primary py-2 text-sm"><Plus size={14} /> 추가</button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 text-text-muted text-sm border border-dashed border-border rounded-xl">
          항목이 없습니다. 추가 버튼을 눌러 시작하세요.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="card flex items-start justify-between gap-4 py-3 px-4">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                {/* 이미지 미리보기 (경력/학력) */}
                {item.imageUrl && (
                  <img src={item.imageUrl} alt="" className="w-8 h-8 rounded-lg object-contain border border-border bg-bg-primary shrink-0 mt-0.5" />
                )}
                {/* 썸네일 미리보기 (프로젝트) */}
                {item.thumbnailUrl && (
                  <img src={item.thumbnailUrl} alt="" className="w-14 h-9 rounded-md object-cover border border-border shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{getItemLabel(item)}</p>
                  {getItemMeta && <p className="text-text-muted text-xs mt-0.5">{getItemMeta(item)}</p>}
                  {item.description && <p className="text-text-secondary text-xs mt-1 line-clamp-1">{item.description}</p>}
                  {item.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {item.tags.slice(0, 3).map((t) => <span key={t} className="tag text-[10px] px-1.5 py-0">{t}</span>)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => openEdit(item)} className="p-1.5 text-text-muted hover:text-accent transition-colors rounded-md hover:bg-accent/10"><Pencil size={14} /></button>
                <button onClick={() => setDeleting(item)} className="p-1.5 text-text-muted hover:text-red-400 transition-colors rounded-md hover:bg-red-400/10"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal.mode === 'add' ? `${label} 추가` : `${label} 수정`} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => <Field key={f.key} field={f} value={formData[f.key]} onChange={setField} />)}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={closeModal} className="btn-outline flex-1 justify-center">취소</button>
              <button type="submit" className="btn-primary flex-1 justify-center">
                <Save size={14} />{modal.mode === 'add' ? '추가' : '저장'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <DeleteConfirm
          label={getItemLabel(deleting)}
          onConfirm={() => { deleteItem(section, deleting.id); setDeleting(null) }}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}

// ─── 프로필 탭 ───────────────────────────────────────────────────
function ProfileTab() {
  const { data, updateProfile } = useData()
  const [form, setForm] = useState({ ...data.profile })
  const [saved, setSaved] = useState(false)
  const setF = (key, val) => setForm((p) => ({ ...p, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProfile({ ...form, roles: strToTags(tagsToStr(form.roles)) })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className={lbl}>이름 (한글) <span className="text-red-400">*</span></label><input value={form.name} onChange={(e) => setF('name', e.target.value)} className={inp} required /></div>
        <div><label className={lbl}>이름 (영문)</label><input value={form.nameEn || ''} onChange={(e) => setF('nameEn', e.target.value)} className={inp} placeholder="Shin Hyuntaek" /></div>
      </div>
      <div><label className={lbl}>직함/직책 <span className="text-red-400">*</span></label><input value={form.title} onChange={(e) => setF('title', e.target.value)} className={inp} required /></div>
      <div>
        <label className={lbl}>역할 키워드 <span className="text-text-muted font-normal">(쉼표 구분, 홈 타이핑 효과)</span></label>
        <input value={tagsToStr(form.roles)} onChange={(e) => setF('roles', e.target.value)} className={inp} placeholder="HRD 담당자, 교육 기획자" />
      </div>
      <div><label className={lbl}>소개글</label><textarea value={form.bio || ''} onChange={(e) => setF('bio', e.target.value)} rows={4} className={inp + ' resize-none'} /></div>
      <div><label className={lbl}>프로필 사진 URL <span className="text-text-muted font-normal">(선택)</span></label><input value={form.photoUrl || ''} onChange={(e) => setF('photoUrl', e.target.value)} className={inp} placeholder="https://..." /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className={lbl}>이메일</label><input type="email" value={form.email || ''} onChange={(e) => setF('email', e.target.value)} className={inp} /></div>
        <div><label className={lbl}>위치</label><input value={form.location || ''} onChange={(e) => setF('location', e.target.value)} className={inp} placeholder="서울, 대한민국" /></div>
      </div>
      <div><label className={lbl}>LinkedIn URL</label><input value={form.linkedin || ''} onChange={(e) => setF('linkedin', e.target.value)} className={inp} placeholder="https://linkedin.com/in/..." /></div>
      <button type="submit" className={`btn-primary w-full justify-center ${saved ? 'bg-green-600 hover:bg-green-600' : ''}`}>
        <Save size={14} />{saved ? '저장 완료!' : '저장'}
      </button>
    </form>
  )
}

// ─── 설정 탭 ─────────────────────────────────────────────────────
function SettingsTab() {
  const { changePassword, resetData, checkPassword } = useData()
  const navigate = useNavigate()
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwMsg, setPwMsg] = useState(null)
  const [showReset, setShowReset] = useState(false)

  const handlePwChange = (e) => {
    e.preventDefault()
    if (!checkPassword(pwForm.current)) return setPwMsg({ type: 'error', text: '현재 비밀번호가 틀렸습니다.' })
    if (pwForm.next.length < 4) return setPwMsg({ type: 'error', text: '새 비밀번호는 4자 이상이어야 합니다.' })
    if (pwForm.next !== pwForm.confirm) return setPwMsg({ type: 'error', text: '새 비밀번호가 일치하지 않습니다.' })
    changePassword(pwForm.next)
    setPwMsg({ type: 'success', text: '비밀번호가 변경되었습니다.' })
    setPwForm({ current: '', next: '', confirm: '' })
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2"><Lock size={15} className="text-accent" /> 비밀번호 변경</h3>
        <form onSubmit={handlePwChange} className="space-y-3">
          {[{ key: 'current', label: '현재 비밀번호' }, { key: 'next', label: '새 비밀번호' }, { key: 'confirm', label: '새 비밀번호 확인' }].map(({ key, label }) => (
            <div key={key}><label className={lbl}>{label}</label><input type="password" value={pwForm[key]} onChange={(e) => setPwForm((p) => ({ ...p, [key]: e.target.value }))} className={inp} /></div>
          ))}
          {pwMsg && <p className={`text-xs ${pwMsg.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{pwMsg.text}</p>}
          <button type="submit" className="btn-primary w-full justify-center">변경</button>
        </form>
      </div>

      <div className="card">
        <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2"><LogOut size={15} className="text-accent" /> 로그아웃</h3>
        <button onClick={() => { sessionStorage.removeItem('admin_ok'); navigate('/') }} className="btn-outline w-full justify-center text-sm">로그아웃</button>
      </div>

      <div className="card border-red-900/30">
        <h3 className="font-semibold text-white text-sm mb-2 flex items-center gap-2"><RotateCcw size={15} className="text-red-400" /> 데이터 초기화</h3>
        <p className="text-text-muted text-xs mb-3">모든 수정 사항을 삭제하고 기본값으로 되돌립니다.</p>
        {!showReset ? (
          <button onClick={() => setShowReset(true)} className="btn-outline border-red-900/40 text-red-400 hover:border-red-400 w-full justify-center text-sm">초기화</button>
        ) : (
          <div className="space-y-2">
            <p className="text-red-400 text-xs font-medium">정말 초기화할까요? 되돌릴 수 없습니다.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowReset(false)} className="btn-outline flex-1 justify-center text-sm">취소</button>
              <button onClick={() => { resetData(); sessionStorage.removeItem('admin_ok'); navigate('/') }} className="flex-1 justify-center px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                <RotateCcw size={13} /> 초기화
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── 탭 목록 ─────────────────────────────────────────────────────
const TABS = [
  { id: 'profile', label: '프로필', icon: User },
  { id: 'experience', label: '경력', icon: Briefcase },
  { id: 'education', label: '학력', icon: GraduationCap },
  { id: 'projects', label: '프로젝트', icon: FolderKanban },
  { id: 'courses', label: '교육과정', icon: BookOpen },
  { id: 'settings', label: '설정', icon: Settings },
]

// ─── 메인 Admin ──────────────────────────────────────────────────
export default function Admin() {
  const { data } = useData()
  const navigate = useNavigate()
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_ok') === '1')
  const [tab, setTab] = useState('profile')

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />

  const renderTab = () => {
    switch (tab) {
      case 'profile': return <ProfileTab />
      case 'experience': return (
        <ListSection
          section="experience" label="경력" items={data.experience}
          fields={SECTION_FIELDS.experience}
          getItemLabel={(i) => `${i.role} @ ${i.company}`}
          getItemMeta={(i) => i.period}
        />
      )
      case 'education': return (
        <ListSection
          section="education" label="학력" items={data.education}
          fields={SECTION_FIELDS.education}
          getItemLabel={(i) => `${i.school} ${i.major}`}
          getItemMeta={(i) => i.period}
        />
      )
      case 'projects': return (
        <ListSection
          section="projects" label="프로젝트" items={data.projects}
          fields={SECTION_FIELDS.projects}
          getItemLabel={(i) => i.title}
          getItemMeta={(i) => i.year}
        />
      )
      case 'courses': return (
        <ListSection
          section="courses" label="교육과정" items={data.courses || []}
          fields={SECTION_FIELDS.courses}
          getItemLabel={(i) => i.title}
          getItemMeta={(i) => [i.target, i.duration].filter(Boolean).join(' · ')}
        />
      )
      case 'settings': return <SettingsTab />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* 헤더 */}
      <div className="border-b border-border bg-bg-secondary/50 backdrop-blur-sm sticky top-16 z-30">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-accent" />
            <span className="text-white text-sm font-medium">관리자 패널</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-text-muted hover:text-white text-xs transition-colors">
              <Eye size={13} /> 포트폴리오 보기
            </button>
            <button onClick={() => { sessionStorage.removeItem('admin_ok'); navigate('/') }} className="flex items-center gap-1.5 text-text-muted hover:text-white text-xs transition-colors">
              <LogOut size={13} /> 로그아웃
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-[200px_1fr] gap-6">
          {/* 사이드 탭 */}
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  tab === id ? 'bg-accent/10 text-white border border-accent/30' : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={15} />{label}
              </button>
            ))}
          </nav>

          {/* 콘텐츠 */}
          <div className="min-w-0">
            <h2 className="text-white font-semibold text-lg mb-5">
              {TABS.find((t) => t.id === tab)?.label}
            </h2>
            {renderTab()}
          </div>
        </div>
      </div>
    </div>
  )
}
