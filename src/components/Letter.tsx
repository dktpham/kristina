import React, { useContext, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { CharStateType } from 'react-typing-game-hook'
import { TypingTestContext } from './Type'
import { useCaret } from './Caret'

export function Letter({ char, index }: { char: string; index: number }) {
  const { states } = useContext(TypingTestContext)
  const { setOffset } = useCaret()
  const ref = useRef<HTMLSpanElement>(null)
  const isActive = (states?.currIndex || 0) + 1 === index

  useEffect(() => {
    if (isActive) {
      setOffset && setOffset(ref?.current?.offsetLeft || 0, ref?.current?.offsetTop || 0)
    }
  }, [isActive])

  return (
    <span
      ref={ref}
      id={`${index}`}
      style={{
        color: clsx({
          '#fff': states?.charsState[index] === CharStateType.Correct,
          '#da3333': states?.charsState[index] === CharStateType.Incorrect,
          '#676e8a': states?.charsState[index] === CharStateType.Incomplete,
        }),
      }}
      className={'letter'}
    >
      {char}
    </span>
  )
}
