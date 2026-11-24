'use client'

import { FloatingPortal } from '@floating-ui/react'

import { useFloating } from '@/lib/hooks/useFloating'
import Icon from '@/ui/icon'

export default function TableActions({ children }: { children: React.ReactNode }) {
  const { isOpen, refs, floatingStyles, getReferenceProps, getFloatingProps } = useFloating({
    placement: 'bottom-start',
  })

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className="cursor-pointer block rounded border border-transparent px-1.5 py-1 text-sm focus-within:border-neutral-500 focus-within:bg-neutral-200 hover:border-neutral-500 hover:bg-neutral-200"
      >
        <Icon icon="ellipsis" strokeWidth={3} />
      </button>
      {isOpen && (
        <FloatingPortal>
          <div
            // False positive in this lint rule: https://github.com/floating-ui/floating-ui/discussions/3405#discussioncomment-14657647
            // eslint-disable-next-line react-hooks/refs
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-20 w-52 rounded-md border border-neutral-200 bg-white p-1 text-sm text-neutral-900 shadow-sm"
          >
            {children === false ? (
              <p className="px-2 py-1.5 italic text-neutral-800">Sin acciones disponibles</p>
            ) : (
              children
            )}
          </div>
        </FloatingPortal>
      )}
    </>
  )
}
