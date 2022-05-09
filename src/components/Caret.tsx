import React, { createContext, useContext, useEffect } from 'react'
import { NewContext } from './Type'

export function Caret() {
  const { offset, typing, setTyping } = useCaret()
  const { times } = useContext(NewContext)

  useEffect(() => {
    if (typing) {
      setTyping && setTyping(false)
    }
  }, [typing, setTyping])

  return (
    <>
      {times.end === 0 && (
        <span
          className={'caret'}
          style={{
            left: (offset.left || 0) - 10,
            top: offset.top,
            animation: typing ? 'none' : 'blink 1s infinite 1s',
          }}
        >
          |
        </span>
      )}
    </>
  )
}

interface Context {
  offset: {
    left: number
    top: number
  }
  setOffset: ((left: number, top: number) => void) | undefined
  typing: boolean
  setTyping: ((active: boolean) => void) | undefined
}

export const CaretContext = createContext<Context>({
  offset: { left: 0, top: 0 },
  setOffset: undefined,
  typing: false,
  setTyping: undefined,
})

export function useCaret() {
  return useContext(CaretContext)
}
