import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface LoginCredentials {
  email: string
  password: string
}

interface ErrorInfo {
  title: string
  message: string
  description: string
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorInfo, setErrorInfo] = useState<ErrorInfo>({
    title: '',
    message: '',
    description: ''
  })
  
  const navigate = useNavigate()

  // 고정된 값들
  const TALENCY_ID = '20250313026'
  const COMPANY_ID = '20250313001'

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)

    try {
      // 백엔드 API 호출
      const response = await fetch('http://localhost:8000/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: `${COMPANY_ID}:${TALENCY_ID}:${credentials.email}`,
          password: credentials.password,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // 토큰을 로컬 스토리지에 저장
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('user_info', JSON.stringify({
          company_id: COMPANY_ID,
          talency_id: TALENCY_ID,
          user_id: credentials.email
        }))
                   
        // AgentDashboard 페이지로 이동
        navigate('/dashboard')
      } else {
        const errorData = await response.json()
        // 오류 정보 설정
        const errorInfoData: ErrorInfo = {
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
      const errorInfoData: ErrorInfo = {
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

  return {
    isLoading,
    showError,
    errorInfo,
    login,
    handleRetry,
    handleGoHome,
    TALENCY_ID,
    COMPANY_ID
  }
} 