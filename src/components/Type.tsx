import '../style/type.css'
import React, { createContext, Dispatch, ReactElement, SetStateAction, useContext, useRef, useState } from 'react'
import { ScreenReaderAlert, ScreenReaderAlertContext } from './ScreenReaderAlert'
import { getTestWords } from '../utils'
import { Caret, CaretContext, useCaret } from './Caret'
import Word from './Word'
import useTypingTest, { WordsState } from './useTypingTest'
import { Result } from './Result'

interface NewState {
  type: (char: string) => void
  backspace: (word?: boolean) => void
  wordState: WordsState
  times: {
    start: number
    end: number
  }
  setText: Dispatch<SetStateAction<string>>
}

export const NewContext = React.createContext<NewState>({
  backspace: () => null,
  type: () => null,
  wordState: {
    currentWordIndex: 0,
    currentCharIndex: 0,
    wordCount: 0,
    textLength: 0,
  },
  times: {
    start: 0,
    end: 0,
  },
  setText: () => undefined,
})

export default function Type() {
  const [text, setText] = useState<string>(getTestWords())
  const [alerts, setAlerts] = useState<string[]>([])
  const [position, setPosition] = useState<number[]>([])
  const [isTyping, setIsTyping] = useState<boolean>(false)

  const { type, backspace, wordState, times } = useTypingTest({ words: text.split(' ') })

  return (
    <ScreenReaderAlertContext.Provider value={{ alerts, setAlerts }}>
      <NewContext.Provider value={{ type, backspace, wordState, times, setText: setText }}>
        <CaretContext.Provider
          value={{
            offset: { left: position[0], top: position[1] },
            setOffset: (left: number, top: number) => setPosition([left, top]),
            typing: isTyping,
            setTyping: (typing) => setIsTyping(typing),
          }}
        >
          <>
            <ScreenReaderAlert />
            <TypingTestContainer>
              <>
                <Caret />
                {Object.keys(wordState).map((key) => {
                  const wordIndex = parseInt(key)
                  const currentWord = wordState[wordIndex]
                  if (currentWord) {
                    const currentWordtext = currentWord.correctChars.join('')
                    return <Word key={`${wordIndex}-${currentWordtext}`} wordIndex={wordIndex} />
                  }
                })}
              </>
            </TypingTestContainer>
          </>
        </CaretContext.Provider>
      </NewContext.Provider>
    </ScreenReaderAlertContext.Provider>
  )
}

function TypingTestContainer({ children }: { children: ReactElement }) {
  const { setAlerts } = useContext(ScreenReaderAlertContext)
  const inputRef = useRef<HTMLInputElement>(null)
  const { setTyping } = useCaret()

  const { type, backspace, wordState, times, setText } = useContext(NewContext)

  const handleKey = (key: string) => {
    if (key === 'Escape') {
      setText(getTestWords())
      // actions?.resetTyping()
      return
    }
    if (key === 'Backspace') {
      backspace()
      setTyping && setTyping(true)
      return
    }
    if (key === 'Control') {
      setAlerts([[wordState[wordState.currentWordIndex]?.correctChars.join('')].join('')])
    }
    if (key.length === 1) {
      type(key)
      setTyping && setTyping(true)
    }
  }

  const onClick = () => inputRef.current?.focus()

  return (
    <div className={'center'} tabIndex={0} role={'textbox'} onClick={onClick}>
      {times.end > 0 && <Result />}
      {times.end === 0 && (
        <>
          <input
            ref={inputRef}
            tabIndex={1}
            autoFocus={true}
            aria-label={'Übungstextfeld'}
            type="text"
            onKeyDown={(e) => {
              handleKey(e.key)
              e.preventDefault()
            }}
            style={{ position: 'absolute', zIndex: -1 }}
          />
          <span className={'wordbox'} aria-hidden={'true'} tabIndex={-1}>
            {children}
          </span>
        </>
      )}
    </div>
  )
}
