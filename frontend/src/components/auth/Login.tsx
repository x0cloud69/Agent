import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginHeader } from './LoginHeader'
import { LoginSidebar } from './LoginSidebar'
import { SocialLogin } from './SocialLogin'
import { PasswordInput } from './PasswordInput'
import ErrorPage from '../common/ErrorPage'

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorInfo, setErrorInfo] = useState({
    title: '',
    message: '',
    description: ''
  })

  const navigate = useNavigate()

  // 고정된 값들
  const TALENCY_ID = '20250313026'
  const COMPANY_ID = '20250313001'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 백엔드 API 호출
      const response = await fetch('http://localhost:8000/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: `${COMPANY_ID}:${TALENCY_ID}:${email}`, // email을 user_id로 사용
          password: password,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // 토큰을 로컬 스토리지에 저장
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('user_info', JSON.stringify({
          company_id: COMPANY_ID,
          talency_id: TALENCY_ID,
          user_id: email
        }))
        // AgentDashboard 페이지로 이동
        navigate('/dashboard')
      } else {
        const errorData = await response.json()
        // 오류 정보 설정
        const errorInfoData = {
          title: '로그인 실패',
          message: '입력하신 정보가 올바르지 않습니다.',
          description: errorData.detail || '사용자 ID와 비밀번호를 다시 확인해주세요.'
        }
        console.log('Setting error info:', errorInfoData)
        setErrorInfo(errorInfoData)
        setShowError(true)
      }
    } catch (error) {
      console.error('Login error:', error)
      // 네트워크 오류 정보 설정
      const errorInfoData = {
        title: '연결 오류',
        message: '서버에 연결할 수 없습니다.',
        description: '인터넷 연결을 확인하고 다시 시도해주세요.'
      }
      console.log('Setting network error info:', errorInfoData)
      setErrorInfo(errorInfoData)
      setShowError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    setShowError(false)
    setErrorInfo({
      title: '',
      message: '',
      description: ''
    })
  }

  const handleGoHome = () => {
    navigate('/')
  }

  // 오류 페이지 표시
  if (showError) {
    return (
      <ErrorPage
        title={errorInfo.title}
        message={errorInfo.message}
        description={errorInfo.description}
        statusCode="401"
        showHomeButton={true}
        showBackButton={false}
        onRetry={handleRetry}
      />
    )
  }

  return (
    <div className="flex flex-1 min-h-full">
      {/* 메인 로그인 영역 */}
      <div className="flex flex-col flex-1 justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <LoginHeader onGoHome={handleGoHome} />

          <div className="mt-10">
            <div>
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
                    Company ID: {COMPANY_ID} | Talency ID: {TALENCY_ID}
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

              <SocialLogin />
            </div>
          </div>
        </div>
      </div>

      {/* 사이드바 */}
      <LoginSidebar />
    </div>
  )
}

export default Login 