import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface ActionButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  isLoading?: boolean
  loadingText?: string
  onClick?: () => void | Promise<void>
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export default function ActionButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  loadingText,
  onClick,
  disabled = false,
  type = 'button',
}: ActionButtonProps) {
  const [localLoading, setLocalLoading] = useState(false)

  const handleClick = async () => {
    if (disabled || localLoading || isLoading) return
    setLocalLoading(true)
    if (onClick) {
      const result = onClick()
      if (result instanceof Promise) {
        await result
      }
    }
    setLocalLoading(false)
  }

  const isLoadingState = isLoading || localLoading

  return (
    <button
      type={type}
      disabled={isLoadingState || disabled}
      onClick={handleClick}
      className={`btn btn-${variant} btn-${size} ${className} ${isLoadingState ? 'opacity-80 cursor-not-allowed' : ''}`}
    >
      {isLoadingState ? (
        <>
          <Loader2 size={16} className="mr-2 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  )
}
