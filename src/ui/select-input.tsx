'use client'

import { useEffect, useRef, useState } from 'react'
import { FloatingPortal, type Placement, size } from '@floating-ui/react'

import { useFloating } from '@/lib/hooks/useFloating'
import Button from '@/ui/button'
import Icon, { type IconName } from '@/ui/icon'
import Label from '@/ui/label'
import SupportingText from '@/ui/supporting-text'
import { parse, cx } from '@/lib/utils'

export default function SelectInput({
  name,
  type,
  options,
  value,
  defaultValue,
  label,
  icon,
  error,
  placeholder,
  isRequired,
  modalPlacement = 'bottom-start',
  wrapperClassName,
  buttonClassName,
  arrowClassName,
  supportingText,
  disabled,
  disableSupportingText = false,
  disableSelectedLabel = false,
  onChange,
}: SelectInputSingleProps | SelectInputMultiProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isOpen, refs, floatingStyles, getReferenceProps, getFloatingProps, closeModal } = useFloating({
    placement: modalPlacement,
    middleware: [
      size({
        apply({ rects, elements }) {
          elements.floating.style.minWidth = `${rects.reference.width}px`
        },
      }),
    ],
  })

  const isControlled = value !== undefined

  const [insideDialog, setInsideDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectOptions, setSelectOptions] = useState(
    Array.isArray(defaultValue) ? defaultValue : defaultValue ? [String(defaultValue)] : [],
  )

  const parsedOptions = options.map((option) =>
    typeof option === 'string' ? { label: option, value: option } : option,
  )
  const searchedOptions = parsedOptions.filter(({ label }) => {
    const parsedLabel = parse.removeAccents(
      String(label ?? '')
        .trim()
        .toLowerCase(),
    )
    const parsedSearch = parse.removeAccents(searchTerm.trim().toLowerCase())

    return parsedLabel.includes(parsedSearch)
  })

  const selectedValues = isControlled
    ? Array.isArray(value)
      ? value.filter(Boolean)
      : value
        ? [String(value)]
        : []
    : selectOptions

  const isSelected = (value: string) => selectedValues.includes(value)
  const handleSelectOption = (value: string) => {
    if (type === 'multi') {
      const updatedValues = isSelected(value) ? selectedValues.filter((v) => v !== value) : [...selectedValues, value]

      if (!isControlled) {
        setSelectOptions(updatedValues)
      }

      return onChange?.(updatedValues)
    }

    closeModal()

    if (!isControlled) {
      setSelectOptions([String(value)])
    }

    onChange?.(value)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setSearchTerm(value)
  }

  useEffect(() => {
    if (containerRef) {
      setInsideDialog(!!containerRef.current?.closest('.dialog'))
    }
  }, [])

  return (
    <div ref={containerRef} className={cx('select-input w-full space-y-1.5', [wrapperClassName])}>
      {label && (
        <Label name={name} isRequired={isRequired}>
          {label}
        </Label>
      )}
      <div className="relative">
        <input type="hidden" id={name} name={name} disabled={disabled} value={selectedValues.join(',')} />
        <button
          ref={refs.setReference}
          {...getReferenceProps()}
          type="button"
          disabled={disabled}
          className={cx(
            'cursor-pointer bg-white text-neutral-800 flex items-center h-9.5 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-800 placeholder:text-neutral-800 outline-none outline-2 -outline-offset-2 focus:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50',
            {
              'pl-3': !icon,
              'outline-red-900': error,
              'text-neutral-1000': selectedValues.length > 0,
            },
            [buttonClassName],
          )}
        >
          {icon && (
            <Icon
              icon={typeof icon === 'string' ? icon : icon.icon}
              className={cx('absolute left-3 top-3 size-4 text-neutral-800 mb-0', [
                typeof icon !== 'string' && icon.className,
              ])}
            />
          )}
          {!disableSelectedLabel && (
            <span
              className={cx('line-clamp-1 leading-none pr-7 text-left', {
                'pl-7': icon,
              })}
            >
              {selectedValues.length > 0
                ? typeof options[0] === 'string'
                  ? selectedValues.join(', ')
                  : (options as { label: string; value: string }[])
                      .filter((option) => selectedValues.includes(option.value))
                      .map((option) => option.label)
                      .join(', ')
                : (placeholder ?? 'Seleccionar')}
            </span>
          )}
          <Icon
            icon="chevronDown"
            className={cx('absolute right-3 top-2.5 size-5 text-neutral-800 mb-0', [arrowClassName])}
          />
        </button>
        {isOpen && (
          <FloatingPortal>
            <div
              // False positive in this lint rule: https://github.com/floating-ui/floating-ui/discussions/3405#discussioncomment-14657647
              // eslint-disable-next-line react-hooks/refs
              ref={refs.setFloating}
              style={{
                ...floatingStyles,
                zIndex: insideDialog ? '50' : '10',
              }}
              {...getFloatingProps()}
              className="max-h-[calc(8px+32px*8)] overflow-y-auto rounded-md border border-neutral-200 bg-white text-sm text-neutral-900 shadow-sm"
            >
              <div className="sticky top-0 flex gap-x-1 bg-white p-1">
                <input
                  name={`${name}-search`}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full rounded border border-neutral-200 px-3 py-1 text-sm outline-none outline-2 -outline-offset-2 placeholder:text-neutral-800 focus:outline-blue-600 "
                  placeholder="Search..."
                />
              </div>
              <div className="p-1">
                {searchedOptions.length > 0 ? (
                  searchedOptions.map(({ value, label }, index) => {
                    const selected = isSelected(value)

                    return (
                      <Button
                        key={`${value}-${index}`}
                        onClick={() => handleSelectOption(value)}
                        variant="transparent"
                        className={cx({
                          'text-neutral-1000 font-medium': selected,
                        })}
                      >
                        {label}
                        {selected && <Icon icon="check" strokeWidth={3} className="mt-0.5" />}
                      </Button>
                    )
                  })
                ) : (
                  <p className="px-2 py-1.5 italic text-neutral-800">No hay opciones para mostrar.</p>
                )}
              </div>
            </div>
          </FloatingPortal>
        )}
      </div>
      {!disableSupportingText && <SupportingText error={error} text={supportingText} />}
    </div>
  )
}

interface SelectInputBaseProps {
  name: string
  options: string[] | { label: string; value: string }[]
  type?: 'single' | 'multi'
  label?: string
  icon?:
    | IconName
    | {
        icon: IconName
        className?: string
      }
  error?: string
  placeholder?: string
  isRequired?: boolean
  modalPlacement?: Placement
  wrapperClassName?: string
  buttonClassName?: string
  arrowClassName?: string
  supportingText?: string
  disableSupportingText?: boolean
  disableSelectedLabel?: boolean
  disabled?: boolean
  handleButtons?: boolean
}

interface SelectInputSingleProps extends SelectInputBaseProps {
  type?: 'single'
  value?: string
  defaultValue?: string
  onChange?: (option: string) => void
}

interface SelectInputMultiProps extends SelectInputBaseProps {
  type: 'multi'
  value?: string[]
  defaultValue?: string[]
  onChange?: (option: string[]) => void
}
