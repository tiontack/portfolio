export const projects = [
  {
    id: 1,
    title: '부부 자산관리 앱',
    description: '토스 CSV를 자동 파싱해서 부부의 지출/수입을 한눈에 관리하는 가계부 웹앱. UTF-8 BOM/EUC-KR 인코딩 자동 감지 지원.',
    category: 'web',
    tags: ['React', 'Node.js', 'SQLite', 'Vite'],
    link: '',
    thumbnailUrl: '',
    featured: true,
    year: '2024',
  },
  {
    id: 2,
    title: '포트폴리오 사이트',
    description: '현재 보고 계신 개인 포트폴리오 사이트. 관리자 패널로 콘텐츠를 직접 편집할 수 있습니다.',
    category: 'web',
    tags: ['React', 'Vite', 'Tailwind CSS'],
    link: '',
    thumbnailUrl: '',
    featured: true,
    year: '2024',
  },
]

export const categories = [
  { value: 'all', label: '전체' },
  { value: 'web', label: '웹/앱' },
  { value: 'tool', label: '도구/자동화' },
  { value: 'data', label: '데이터' },
  { value: 'other', label: '기타' },
]
