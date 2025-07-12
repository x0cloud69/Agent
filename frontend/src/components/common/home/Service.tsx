import { InboxIcon, TrashIcon, UsersIcon } from '@heroicons/react/24/outline'

const features = [
  {
    name: 'SaaS Agent',
    description:
      'SaaS Agent는 클라우드 기반 소프트웨어 서비스 환경에서 작동하는 지능형 소프트웨어 프로그램으로, 특정 작업을 자동화하고 관리하는 AI 기반 시스템입니다.',
    href: '#',
    icon: InboxIcon,
  },
  {
    name: 'On-Demand Agent',
    description:
      'On-Demand Agent는 고객사의 필요와 요구에 맞추어 특정 작업을 수행하는 AI 기반 소프트웨어 에이전트입니다. ',
    href: '#',
    icon: UsersIcon,
  },
  {
    name: 'Personalized Agent',
    description:
      'Personalized Agent는 개인의 일상과 업무를 더욱 효율적이고 편리하게 만들어주는 동시에, 지속적인 학습을 통해 더욱 발전된 서비스를 제공할 수 있는 미래 지향적 기술입니다.',
    href: '#',
    icon: TrashIcon,
  },
]

export default function Example() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
            목적 지향적 AI 에이전트
          </h2>
          <p className="mt-6 text-center text-lg/8 text-gray-600">
            고객사 사업형태에 맞춰 최적의 서비스를 제공합니다.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="text-base/7 font-semibold text-gray-900">
                  <div className="mb-6 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon aria-hidden="true" className="size-6 text-white" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base/7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    <a href={feature.href} className="text-sm/6 font-semibold text-indigo-600">
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
