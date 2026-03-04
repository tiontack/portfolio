import { createContext, useContext, useState, useEffect } from 'react'
import { profile as defaultProfile, experience as defaultExperience, education as defaultEducation } from '../data/profile'
import { projects as defaultProjects } from '../data/projects'
import { courses as defaultCourses } from '../data/courses'

const STORAGE_KEY = 'portfolio_data'
const PASSWORD_KEY = 'portfolio_admin_pw'
export const DEFAULT_PASSWORD = 'hrd2024'

const defaultData = {
  profile: defaultProfile,
  experience: defaultExperience,
  education: defaultEducation,
  projects: defaultProjects,
  courses: defaultCourses,
}

function load() {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (!s) return null
    const parsed = JSON.parse(s)
    // courses 키가 없는 구버전 데이터면 기본값 주입
    if (!parsed.courses) parsed.courses = defaultCourses
    return parsed
  } catch {
    return null
  }
}

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [data, setData] = useState(() => load() || defaultData)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const updateProfile = (updates) =>
    setData((p) => ({ ...p, profile: { ...p.profile, ...updates } }))

  const addItem = (section, item) =>
    setData((p) => ({
      ...p,
      [section]: [...(p[section] || []), { ...item, id: Date.now() }],
    }))

  const updateItem = (section, id, updates) =>
    setData((p) => ({
      ...p,
      [section]: (p[section] || []).map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }))

  const deleteItem = (section, id) =>
    setData((p) => ({
      ...p,
      [section]: (p[section] || []).filter((i) => i.id !== id),
    }))

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEY)
    setData(defaultData)
  }

  const checkPassword = (pw) => {
    const stored = localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD
    return pw === stored
  }

  const changePassword = (newPw) => {
    localStorage.setItem(PASSWORD_KEY, newPw)
  }

  return (
    <DataContext.Provider
      value={{
        data,
        updateProfile,
        addItem,
        updateItem,
        deleteItem,
        resetData,
        checkPassword,
        changePassword,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
