import { useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  autoComplete?: string
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = "비밀번호를 입력하세요",
  required = true,
  autoComplete = "current-password"
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div>
      <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
        비밀번호
      </label>
      <div className="mt-2">
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete={autoComplete}
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 pr-10 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder={placeholder}
          />
          <button
            type="button"
            className="flex absolute inset-y-0 right-0 items-center pr-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="w-4 h-4 text-gray-400" aria-hidden="true" />
            ) : (
              <EyeIcon className="w-4 h-4 text-gray-400" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 