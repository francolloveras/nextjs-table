'use client'

import { useState } from 'react'
import { FloatingPortal, type Placement } from '@floating-ui/react'

import { useFloating } from '@/lib/hooks/useFloating'
import Button from '@/ui/button'
import Icon, { type IconName } from '@/ui/icon'
import Label from '@/ui/label'
import SupportingText from '@/ui/supporting-text'
import { parse } from '@/lib/utils'
import { cx } from '@/lib/utils'

export default function DateInput({
  name,
  variant = 'default',
  mode,
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
  supportingText,
  disabled,
  readOnly,
  disableSupportingText = false,
  onChange,
}: DateInputSingle | DateInputRange) {
  const { isOpen, refs, floatingStyles, getReferenceProps, getFloatingProps, closeModal } = useFloating({
    placement: modalPlacement,
  })

  const isRange = mode === 'range'
  const isMonth = variant === 'month'

  const today = new Date()
  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth()
  const todayDate = today.getDate()

  const isControlled = value !== undefined

  const [internalValue, setInternalValue] = useState(defaultValue ?? (isRange ? { from: null, to: null } : null))

  const selectedValue = isControlled ? value : internalValue

  const [hours, setHours] = useState(selectedValue instanceof Date ? selectedValue.getHours().toString() : '12')
  const [minutes, setMinutes] = useState(selectedValue instanceof Date ? selectedValue.getMinutes().toString() : '00')

  const [currentDate, setCurrentDate] = useState(
    selectedValue ? (selectedValue instanceof Date ? selectedValue : (selectedValue.from ?? today)) : today,
  )

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const handlePrevYear = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear() - 1, prev.getMonth(), 1))
  }

  const handleNextYear = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear() + 1, prev.getMonth(), 1))
  }

  const getDateAtMidnight = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  const handleMonthClick = (monthIndex: number) => {
    const newDate = new Date(year, monthIndex, 1, 12, 0)

    if (isRange) {
      const { from, to } = (selectedValue as DateRange | null) ?? { from: null, to: null }

      const newRange: DateRange = (() => {
        if (!from) return { from: newDate, to: null }
        if (!to) return newDate < from ? { from: newDate, to: from } : { from, to: newDate }
        if (newDate.toISOString() === from.toISOString()) return { from: null, to: null }
        if (newDate.toISOString() === to.toISOString()) return { from: newDate, to: null }

        return newDate < from ? { from: newDate, to } : { from, to: newDate }
      })()

      if (!isControlled) setInternalValue(newRange)
      onChange?.(newRange)
      if (newRange.from && newRange.to) closeModal()
      return
    }

    if (!isControlled) {
      setInternalValue(newDate)
    }

    onChange?.(newDate)
    closeModal()
  }

  const handleDayClick = ({ day, type }: CalendarDay) => {
    const selectedMonth = type === 'prev' ? month - 1 : type === 'next' ? month + 1 : month
    const newDate = new Date(year, selectedMonth, day, 12, 0)

    if (type !== 'current') {
      setCurrentDate(newDate)
    }

    if (!isRange) {
      if (selectedValue instanceof Date && parse.toISOString(selectedValue) === parse.toISOString(newDate)) {
        setInternalValue(null)
        return onChange?.(null)
      }

      if (!isControlled) setInternalValue(newDate)
      setHours(newDate.getHours().toString())
      setMinutes(newDate.getMinutes().toString())
      onChange?.(newDate)
      if (variant !== 'datetime') {
        closeModal()
      }
    }

    if (isRange) {
      const { from, to } = (selectedValue as DateRange | null) ?? { from: null, to: null }

      const newRange: DateRange = (() => {
        if (!from) return { from: newDate, to: null }
        if (from && !to) {
          return newDate < from ? { from: newDate, to: from } : { from, to: newDate }
        }
        if (newDate.toISOString() === from.toISOString()) return { from: null, to: null }
        if (newDate.toISOString() === to?.toISOString()) return { from: newDate, to: null }

        return newDate < from ? { from: newDate, to } : { from, to: newDate }
      })()

      if (!isControlled) setInternalValue(newRange)
      onChange?.(newRange)
    }
  }

  const handleTimeChange =
    (setter: React.Dispatch<React.SetStateAction<string>>, type: string) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/\D/g, '').slice(0, 2)
      setter(value)

      if (!isRange && selectedValue instanceof Date) {
        const newDate = selectedValue

        if (type === 'hours') newDate.setHours(Number(value))
        if (type === 'minutes') newDate.setMinutes(Number(value))

        if (!isControlled) setInternalValue(newDate)
        onChange?.(newDate)
      }
    }

  const inputValue = (() => {
    if (isRange && (selectedValue as DateRange | null)?.from && (selectedValue as DateRange | null)?.to) {
      const { from, to } = selectedValue as DateRange

      return `${parse.toISOString(from)} - ${parse.toISOString(to)}`
    }

    if (!isRange && selectedValue instanceof Date) {
      return variant === 'datetime'
        ? selectedValue.toISOString()
        : variant === 'month'
          ? `${selectedValue.getFullYear()}-${String(selectedValue.getMonth() + 1).padStart(2, '0')}`
          : parse.toISOString(selectedValue)
    }

    return ''
  })()

  const children = (() => {
    if (isRange && (selectedValue as DateRange | null)?.from) {
      return `${(selectedValue as DateRange).from?.toLocaleDateString('es-AR', { dateStyle: 'short' })} - ${(selectedValue as DateRange).to?.toLocaleDateString('es-AR', { dateStyle: 'short' }) ?? ''}`
    }

    if (!isRange && selectedValue instanceof Date) {
      return variant === 'datetime'
        ? selectedValue.toLocaleString('es-AR', {
            hourCycle: 'h24',
            timeStyle: 'short',
            dateStyle: 'short',
          })
        : variant === 'month'
          ? selectedValue.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
          : selectedValue.toLocaleDateString('es-AR', { dateStyle: 'short' })
    }

    return placeholder ?? 'Seleccionar fecha'
  })()

  const days = (() => {
    const firstDayOfMonth = new Date(year, month, 1)
    const startingDayOffset = firstDayOfMonth.getDay()

    const totalCells = 42

    const prevMonthDate = new Date(year, month, 0)
    const prevMonthDays = prevMonthDate.getDate()

    const previousMonthTail: CalendarDay[] = Array.from({ length: startingDayOffset }, (_, i) => ({
      day: prevMonthDays - startingDayOffset + 1 + i,
      type: 'prev',
    }))

    const currentMonthDays: CalendarDay[] = Array.from({ length: new Date(year, month + 1, 0).getDate() }, (_, i) => ({
      day: i + 1,
      type: 'current',
    }))

    const nextMonthDaysToShow = totalCells - (previousMonthTail.length + currentMonthDays.length)
    const nextMonthHead: CalendarDay[] = Array.from({ length: nextMonthDaysToShow }, (_, i) => ({
      day: i + 1,
      type: 'next',
    }))

    return [...previousMonthTail, ...currentMonthDays, ...nextMonthHead]
  })()

  return (
    <div className={cx('w-full space-y-1.5', [wrapperClassName])}>
      {label && (
        <Label name={name} isRequired={isRequired}>
          {label}
        </Label>
      )}
      <div className="relative">
        <input type="hidden" id={name} name={name} disabled={disabled} readOnly={readOnly} value={inputValue} />
        <button
          ref={refs.setReference}
          {...getReferenceProps()}
          type="button"
          disabled={disabled ?? readOnly}
          className={cx(
            'cursor-pointer bg-white min-w-52 text-neutral-800 flex items-center h-9.5 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm ring-offset-neutral-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-800 placeholder:text-neutral-800 outline-none outline-2 -outline-offset-2 focus:outline-orange-500 disabled:cursor-not-allowed disabled:opacity-50',
            {
              'pl-3': !icon,
              'outline-red-900': error,
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
          <span
            className={cx('line-clamp-1 leading-none pr-7 text-left', {
              'pl-7': icon,
              'text-neutral-1000': children !== placeholder && children !== 'Seleccionar fecha',
            })}
          >
            {children}
          </span>
        </button>
        {isOpen && (
          <FloatingPortal>
            <div
              // False positive in this lint rule: https://github.com/floating-ui/floating-ui/discussions/3405#discussioncomment-14657647
              // eslint-disable-next-line react-hooks/refs
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className="z-50 flex w-fit flex-col gap-y-1 rounded-md border border-neutral-200 bg-white p-3 text-sm text-neutral-900 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between gap-x-2">
                <div className="flex gap-x-1">
                  <Button icon="chevronsLeft" onClick={handlePrevYear} className="size-8 p-0" variant="outline" />
                  {!isMonth && (
                    <Button icon="chevronLeft" onClick={handlePrevMonth} className="size-8 p-0" variant="outline" />
                  )}
                </div>
                <p className="text-sm font-medium">
                  {!isMonth && currentDate.toLocaleString('default', { month: 'short' }).toUpperCase()} {year}
                </p>
                <div className="flex gap-x-1">
                  {!isMonth && (
                    <Button icon="chevronRight" onClick={handleNextMonth} className="size-8 p-0" variant="outline" />
                  )}
                  <Button icon="chevronsRight" onClick={handleNextYear} className="size-8 p-0" variant="outline" />
                </div>
              </div>
              {variant === 'month' ? (
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 12 }, (_, monthIndex) => {
                    const monthDate = new Date(year, monthIndex, 1)

                    const isSelected =
                      !isRange &&
                      selectedValue instanceof Date &&
                      selectedValue.getFullYear() === year &&
                      selectedValue.getMonth() === monthIndex

                    return (
                      <Button
                        key={monthIndex}
                        onClick={() => handleMonthClick(monthIndex)}
                        className={cx('h-9 justify-center px-3', {
                          'bg-primary-600 text-primary-100 hover:bg-primary-600 hover:text-primary-100': isSelected,
                        })}
                        variant="transparent"
                      >
                        {monthDate
                          .toLocaleString('es-AR', {
                            month: 'short',
                          })
                          .replace('.', '')}
                      </Button>
                    )
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-7 justify-items-center">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                    <p key={day} className="pb-2 text-neutral-800">
                      {day}
                    </p>
                  ))}
                  {days.map(({ day, type }, index) => {
                    const isToday =
                      type === 'current' && year === todayYear && month === todayMonth && day === todayDate

                    const currentFullDate = new Date(
                      type === 'prev' ? year : type === 'next' ? year : year,
                      type === 'prev' ? month - 1 : type === 'next' ? month + 1 : month,
                      day,
                    )

                    const currentMidnight = getDateAtMidnight(currentFullDate)

                    const isSelected =
                      !isRange &&
                      selectedValue instanceof Date &&
                      getDateAtMidnight(selectedValue).getTime() === currentMidnight.getTime()

                    const isSelectedStart =
                      isRange &&
                      (selectedValue as DateRange | null)?.from &&
                      getDateAtMidnight((selectedValue as DateRange).from!).getTime() === currentMidnight.getTime()

                    const isSelectedEnd =
                      isRange &&
                      (selectedValue as DateRange | null)?.to &&
                      getDateAtMidnight((selectedValue as DateRange).to!).getTime() === currentMidnight.getTime()

                    const isInRange =
                      isRange &&
                      (selectedValue as DateRange | null)?.from &&
                      (selectedValue as DateRange | null)?.to &&
                      currentMidnight >= getDateAtMidnight((selectedValue as DateRange).from!) &&
                      currentMidnight <= getDateAtMidnight((selectedValue as DateRange).to!)

                    return (
                      <Button
                        key={index}
                        onClick={() => handleDayClick({ day, type })}
                        className={cx('relative size-9 justify-center p-0', {
                          'text-neutral-700': type === 'prev' || type === 'next',
                          'font-semibold': isToday,
                          'bg-neutral-100 rounded-none': isInRange,
                          'bg-orange500 text-orange-100 hover:bg-orange-500 hover:text-orange-100':
                            isSelected || isSelectedStart || isSelectedEnd,
                          'rounded-l-md': isSelectedStart,
                          'rounded-r-md': isSelectedEnd,
                        })}
                        variant="transparent"
                      >
                        {day}
                        {isToday && (
                          <span
                            className={cx(
                              'absolute inset-x-1/2 bottom-1.5 h-0.5 w-4 -translate-x-1/2 rounded-full bg-orange-500',
                              {
                                'bg-orange-100': isSelected,
                              },
                            )}
                          />
                        )}
                      </Button>
                    )
                  })}
                </div>
              )}
              {variant === 'datetime' && (
                <>
                  <div className="-mx-3 my-1 h-px border-t border-neutral-200" />
                  <div className="flex items-center justify-center gap-x-3">
                    <input
                      type="number"
                      max="24"
                      min="0"
                      value={hours}
                      onChange={handleTimeChange(setHours, 'hours')}
                      className="flex h-8 max-w-24 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none outline-2 -outline-offset-2 ring-offset-neutral-200 focus:outline-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!selectedValue}
                    />
                    <span className="text-lg">:</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={minutes}
                      onChange={handleTimeChange(setMinutes, 'minutes')}
                      className="flex h-8 max-w-24 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none outline-2 -outline-offset-2 ring-offset-neutral-200 focus:outline-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!selectedValue}
                    />
                  </div>
                </>
              )}
              <div className="-mx-3 my-1 h-px border-t border-neutral-200" />
              <div className="flex gap-x-2">
                <Button onClick={closeModal} variant="outline" className="h-8">
                  Cancelar
                </Button>
                <Button onClick={closeModal} className="h-8">
                  Aplicar
                </Button>
              </div>
            </div>
          </FloatingPortal>
        )}
      </div>
      {!disableSupportingText && <SupportingText error={error} text={supportingText} />}
    </div>
  )
}

interface DateInputBase {
  name: string
  variant?: 'default' | 'datetime' | 'month'
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
  supportingText?: string
  disableSupportingText?: boolean
  disabled?: boolean
  readOnly?: boolean
}

interface DateInputSingle extends DateInputBase {
  mode?: 'single'
  value?: Date | null
  defaultValue?: Date
  onChange?: (date: Date | null) => void
}

interface DateInputRange extends DateInputBase {
  mode: 'range'
  value?: DateRange | null
  defaultValue?: DateRange
  onChange?: (date: DateRange | null) => void
}

export interface CalendarDay {
  day: number
  type: 'prev' | 'current' | 'next'
}

export interface DateRange {
  from: Date | null
  to: Date | null
}
