import React, { useContext, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { NewContext } from './Type'
import { useCaret } from './Caret'
import { CharState } from './useTypingTest'

export function Letter({ wordIndex, charIndex }: { charIndex: number; wordIndex: number }) {
  const { wordState } = useContext(NewContext)
  const { setOffset } = useCaret()
  const ref = useRef<HTMLSpanElement>(null)
  const isActive = wordState.currentWordIndex === wordIndex && wordState.currentCharIndex === charIndex

  useEffect(() => {
    if (isActive) {
      setOffset && setOffset(ref?.current?.offsetLeft || 0, ref?.current?.offsetTop || 0)
    }
  }, [isActive])

  return (
    <span
      ref={ref}
      style={{
        color: clsx({
          '#fff': wordState[wordIndex].inputChars[charIndex].state === CharState.Correct,
          '#da3333':
            wordState[wordIndex].inputChars[charIndex].state === CharState.Incorrect ||
            wordState[wordIndex].inputChars[charIndex].state === CharState.Additional,
          '#676e8a': wordState[wordIndex].inputChars[charIndex].state === CharState.Untouched,
        }),
      }}
      className={'letter'}
    >
      {wordState[wordIndex].inputChars[charIndex].char}
    </span>
  )
}
