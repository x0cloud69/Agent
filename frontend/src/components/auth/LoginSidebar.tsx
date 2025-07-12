export const LoginSidebar: React.FC = () => {
  return (
    <div className="hidden relative flex-1 w-0 lg:block">
      <img
        className="object-cover absolute inset-0 w-full h-full"
        src="/image/hero.png"
        alt="AI Agent Solutions"
      />
      <div className="absolute inset-0 bg-indigo-600/20" />
      <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent from-indigo-600/40" />
      <div className="absolute right-0 bottom-0 left-0 p-12 text-white">
        <h3 className="mb-4 text-2xl font-bold">AI Agent로 업무 혁신을 경험하세요</h3>
        <p className="text-lg opacity-90">
          지능형 AI 에이전트가 귀사의 업무 프로세스를 자동화하고 효율성을 극대화합니다.
        </p>
      </div>
    </div>
  )
} 