import { useNavigate } from 'react-router-dom'

interface ErrorPageProps {
  title?: string
  message?: string
  description?: string
  statusCode?: string
  showHomeButton?: boolean
  showBackButton?: boolean
  onRetry?: () => void
}

export default function ErrorPage({
  title = "페이지를 찾을 수 없습니다",
  message = "죄송합니다. 요청하신 페이지를 찾을 수 없습니다.",
  description = "페이지가 삭제되었거나, URL이 변경되었거나, 일시적으로 사용할 수 없을 수 있습니다.",
  statusCode = "404",
  showHomeButton = true,
  showBackButton = true,
  onRetry
}: ErrorPageProps) {
  const navigate = useNavigate()

  // 디버깅을 위한 콘솔 로그
  console.log('ErrorPage props:', { title, message, description, statusCode })

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="flex w-full h-screen">
      <div className="flex flex-col flex-1 justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <img
                className="w-auto h-10"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                alt="AI Agent Solutions"
              />
            </div>
            
            {/* 오류 코드 */}
            <div className="mb-6">
              <span className="text-6xl font-bold text-gray-200">{statusCode}</span>
            </div>

            {/* 제목 */}
            <h1 className="mb-4 text-2xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>

            {/* 메시지 */}
            <p className="mb-4 text-lg text-gray-600">
              {message}
            </p>

            {/* 설명 */}
            <p className="mb-8 text-sm text-gray-500">
              {description}
            </p>

            {/* 버튼들 */}
            <div className="flex flex-col gap-3 justify-center sm:flex-row">
              {showHomeButton && (
                <button
                  onClick={handleGoHome}
                  className="flex justify-center px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  홈으로 돌아가기
                </button>
              )}
              
              {showBackButton && (
                <button
                  onClick={handleGoBack}
                  className="flex justify-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  이전 페이지로
                </button>
              )}

              {onRetry && (
                <button
                  onClick={onRetry}
                  className="flex justify-center px-3 py-2 text-sm font-semibold text-white bg-green-600 rounded-md shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  다시 시도
                </button>
              )}
            </div>

            {/* 도움말 링크 */}
            <div className="mt-8 text-sm text-gray-500">
              <p>
                도움이 필요하시면{' '}
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  고객 지원팀
                </a>
                에 문의해주세요.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 오른쪽 이미지 */}
      <div className="hidden relative flex-1 lg:block">
        <div className="flex absolute inset-x-0 inset-y-8 justify-center items-center bg-white rounded-lg">
          <img
            className="object-contain object-center w-full h-full rounded-lg"
            src={statusCode === "401" ? "/image/401_Page.jpg" : "/image/404_Page.jpg"}
            alt={`${statusCode} 오류 페이지 이미지`}
          />
        </div>
      </div>
    </div>
  )
} 