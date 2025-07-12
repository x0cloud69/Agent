import { useState } from 'react'
import { PasswordInput } from './PasswordInput'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void
  isLoading: boolean
  companyId: string
  talencyId: string
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  companyId,
  talencyId
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          사용자 ID (이메일)
        </label>
        <div className="mt-2">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="사용자 ID를 입력하세요"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Company ID: {companyId} | Talency ID: {talencyId}
        </p>
      </div>

      <PasswordInput
        value={password}
        onChange={setPassword}
      />

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-600"
          />
          <label htmlFor="remember-me" className="block ml-3 text-sm leading-6 text-gray-900">
            로그인 상태 유지
          </label>
        </div>

        <div className="text-sm leading-6">
          <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
            비밀번호를 잊으셨나요?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </div>
    </form>
  )
} 