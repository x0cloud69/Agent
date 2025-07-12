import { CheckIcon } from '@heroicons/react/20/solid'

const tiers = [
  {
    name: '근태관리 AI',
    id: 'attendance',
    href: '#',
    price: { monthly: '₩50,000' },
    description: 'AI 기반 근태관리로 출퇴근부터 초과근무까지 자동 분석',
    features: [
      '실시간 출퇴근 기록',
      '초과근무 자동 계산',
      '휴가 관리 시스템',
      '근태 리포트 생성',
      '모바일 앱 지원',
      'API 연동 지원',
    ],
    featured: false,
  },
  {
    name: '조직문화 분석 AI',
    id: 'culture',
    href: '#',
    price: { monthly: '₩80,000' },
    description: '구성원들의 목소리를 실시간 분석하고 조직 문화 개선 인사이트 제공',
    features: [
      '직원 만족도 조사',
      '조직 문화 분석 리포트',
      '이직률 예측 모델',
      '개선 제안 시스템',
      '실시간 피드백 수집',
      '데이터 시각화 대시보드',
    ],
    featured: true,
  },
  {
    name: '스케줄 어시스턴트',
    id: 'schedule',
    href: '#',
    price: { monthly: '₩60,000' },
    description: 'AI 기반 스마트 일정관리 비서로 회의 일정 조율 및 업무 우선순위 설정',
    features: [
      '자동 회의 일정 조율',
      '업무 우선순위 설정',
      '시간 관리 최적화',
      '캘린더 연동',
      '알림 시스템',
      '팀 일정 공유',
    ],
    featured: false,
  },
  {
    name: '태스크 네비게이터',
    id: 'task',
    href: '#',
    price: { monthly: '₩40,000' },
    description: '할 일을 스마트하게 관리하는 지능형 업무 도우미',
    features: [
      '태스크 자동 분류',
      '마감일 관리',
      '진행 상황 모니터링',
      '우선순위 설정',
      '팀 협업 기능',
      '성과 분석 리포트',
    ],
    featured: false,
  },
  {
    name: '공공지원 교육 AI',
    id: 'education',
    href: '#',
    price: { monthly: '₩70,000' },
    description: 'AI 기반 공공지원 및 교육 전문가로 맞춤형 교육 콘텐츠 제공',
    features: [
      '맞춤형 교육 콘텐츠',
      '실시간 문의 응대',
      '업무 가이드 제작',
      '학습 진도 관리',
      '퀴즈 및 평가 시스템',
      '인증서 발급',
    ],
    featured: false,
  },
  {
    name: '규정준수 모니터링',
    id: 'compliance',
    href: '#',
    price: { monthly: '₩90,000' },
    description: '사내규정과 근로기준법 준수 여부를 실시간으로 모니터링',
    features: [
      '법규 준수 모니터링',
      '위험 요소 감지',
      '자동 알림 시스템',
      '준수 리포트 생성',
      '정책 업데이트 관리',
      '감사 지원 기능',
    ],
    featured: false,
  },
]

const onDemandTier = {
  name: 'On-Demand',
  id: 'on-demand',
  href: '#',
  price: { monthly: '영업팀 문의' },
  description: '맞춤형 AI Agent 솔루션으로 기업의 특수한 요구사항에 대응',
  features: [
    '맞춤형 AI 모델 개발',
    '전용 서버 인프라',
    '24/7 기술 지원',
    '전담 매니저 배정',
    'SLA 보장',
    '무제한 사용자',
  ],
  featured: false,
  cta: '영업팀 문의하기',
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  return (
    <div className="bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-base font-semibold leading-7 text-indigo-400">가격 정책</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            AI Agent 제품별 월 이용료
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            기업 규모와 요구사항에 맞는 최적의 AI Agent 솔루션을 선택하세요.
            <br />
            모든 요금은 월 단위로 청구되며, 연간 계약 시 할인 혜택을 제공합니다.
          </p>
        </div>
        
        {/* SaaS 제품별 가격 */}
        <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                tier.featured ? 'ring-2 ring-indigo-600' : 'ring-1 ring-gray-200',
                'rounded-3xl p-8 xl:p-10'
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3 className="text-lg font-semibold leading-8 text-white">{tier.name}</h3>
                {tier.featured && (
                  <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-400">
                    인기
                  </p>
                )}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-300">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-white">{tier.price.monthly}</span>
                <span className="text-sm font-semibold leading-6 text-gray-300">/월</span>
              </p>
              <a
                href={tier.href}
                className={classNames(
                  tier.featured
                    ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600'
                    : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300',
                  'mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                )}
              >
                시작하기
              </a>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon className="h-6 w-5 flex-none text-indigo-400" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* On-Demand 섹션 */}
        <div className="mx-auto mt-16 max-w-2xl">
          <div className="rounded-3xl bg-gray-900 p-8 ring-1 ring-gray-700 xl:p-10">
            <div className="flex items-center justify-between gap-x-4">
              <h3 className="text-lg font-semibold leading-8 text-white">{onDemandTier.name}</h3>
              <p className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                맞춤형
              </p>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-300">{onDemandTier.description}</p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-white">{onDemandTier.price.monthly}</span>
            </p>
            <a
              href={onDemandTier.href}
              className="mt-6 block rounded-md bg-white px-3 py-2 text-center text-sm font-semibold leading-6 text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {onDemandTier.cta}
            </a>
            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300">
              {onDemandTier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-white" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="mx-auto mt-16 max-w-2xl text-center">
          <p className="text-sm leading-6 text-gray-300">
            모든 요금은 부가세 별도입니다. 연간 계약 시 20% 할인 혜택을 제공합니다.
            <br />
            자세한 내용은 <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">영업팀</a>에 문의하세요.
          </p>
        </div>
      </div>
    </div>
  )
}
