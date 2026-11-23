'use client'

import { useState } from 'react'

import Icon, { type IconName } from '@/ui/icon'
import Label from '@/ui/label'
import SupportingText from '@/ui/supporting-text'
import { cx } from '@/lib/utils'

export default function Input({
  name,
  label,
  icon,
  error,
  isRequired,
  wrapperClassName,
  supportingText,
  disableSupportingText = false,
  className,
  format,
  ...rest
}: {
  name: string
  label?: string
  icon?:
    | IconName
    | {
        icon: IconName
        className?: string
      }
  error?: string
  isRequired?: boolean
  wrapperClassName?: string
  supportingText?: React.ReactNode
  disableSupportingText?: boolean
  format?: (value: string) => string
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  const [showPassword, setShowPassword] = useState(false)

  const isPasswordType = rest.type === 'password'

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (format) {
      event.target.value = format(event.target.value)
    }

    rest.onChange?.(event)
  }

  return (
    <div className={cx('w-full space-y-1.5', [wrapperClassName])}>
      {label && (
        <Label name={name} isRequired={isRequired}>
          {label}
        </Label>
      )}
      <div className="relative">
        {icon && (
          <Icon
            icon={typeof icon === 'string' ? icon : icon.icon}
            className={cx('absolute left-3 top-3 size-4 text-neutral-800', [
              typeof icon !== 'string' && icon.className,
            ])}
          />
        )}
        <input
          {...rest}
          id={name}
          name={name}
          type={showPassword ? 'text' : rest.type}
          className={cx(
            'flex h-9.5 w-full bg-white rounded-md border border-neutral-200 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-800 placeholder:text-neutral-800 outline-none outline-2 -outline-offset-2 focus:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 readonly:opacity-50 readonly:cursor-not-allowed',
            {
              'pl-10': icon,
              'pl-3': !icon,
              'outline-red-900': error,
              'pr-10': isPasswordType,
            },
            [className],
          )}
          onChange={handleChange}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-0 top-0 h-full px-3 py-2 text-neutral-900"
          >
            <Icon icon={showPassword ? 'eyeOff' : 'eye'} />
          </button>
        )}
      </div>
      {!disableSupportingText && <SupportingText error={error} text={supportingText} />}
    </div>
  )
}

export function formatter(value: string, mask: string) {
  const clean = value.replace(/[^a-zA-Z0-9]/g, '')
  const firstPlaceholderIndex = mask.indexOf('#')
  const maskPrefix = firstPlaceholderIndex > -1 ? mask.slice(0, firstPlaceholderIndex) : ''
  const cleanWithoutPrefix =
    maskPrefix && clean.toUpperCase().startsWith(maskPrefix.toUpperCase()) ? clean.slice(maskPrefix.length) : clean
  let result = ''
  let valueIndex = 0

  for (let i = 0; i < mask.length; i++) {
    if (mask[i] === '#') {
      if (valueIndex >= cleanWithoutPrefix.length) break
      result += cleanWithoutPrefix[valueIndex]
      valueIndex++
    } else {
      if (valueIndex < cleanWithoutPrefix.length) {
        result += mask[i]
      }
    }
  }

  return result.toUpperCase()
}
