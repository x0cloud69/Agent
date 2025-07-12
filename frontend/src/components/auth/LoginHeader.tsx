interface LoginHeaderProps {
  onGoHome: () => void
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ onGoHome }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <img
          className="w-auto h-10"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          alt="AI Agent Solutions"
        />
        <button
          onClick={onGoHome}
          className="text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          ← 홈으로 돌아가기
        </button>
      </div>
      <h2 className="text-2xl font-bold tracking-tight leading-9 text-gray-900">
        계정에 로그인
      </h2>
      <p className="mt-2 text-sm leading-6 text-gray-500">
        AI Agent Solutions의 모든 기능을 이용하세요.{' '}
        <br />
        <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
          무료 체험 시작하기
        </a>
      </p>
    </div>
  )
} 