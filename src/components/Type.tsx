import '../style/type.css'
import React, { Dispatch, ReactElement, SetStateAction, useContext, useRef, useState } from 'react'
import { TypingActionType, TypingStateType } from 'react-typing-game-hook/dist/types'
import { ScreenReaderAlert, ScreenReaderAlertContext } from './ScreenReaderAlert'
import { getTestWords, getWords } from '../utils'
import { Letter } from './Letter'
import { Caret, CaretContext, useCaret } from './Caret'
import useTypingGame from 'react-typing-game-hook'
import Word from './Word'

interface TypingGameState {
  states: TypingStateType | undefined
  actions: TypingActionType | undefined
  testtext: string
  setText: Dispatch<SetStateAction<string>>
  words: string[]
}

export const TypingTestContext = React.createContext<TypingGameState>({
  actions: undefined,
  states: undefined,
  testtext: '',
  setText: () => undefined,
  words: [],
})

export default function Type() {
  const [text, setText] = useState<string>(getTestWords())
  const [alerts, setAlerts] = useState<string[]>([])
  const [position, setPosition] = useState<number[]>([])
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const words = text.split(' ')
  const gameState = useTypingGame(text)

  return (
    <TypingTestContext.Provider value={{ ...gameState, testtext: text, words: words, setText: setText }}>
      <ScreenReaderAlertContext.Provider value={{ alerts, setAlerts }}>
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
                {words.map((word, wordIndex) => (
                  <Word key={`${wordIndex}-${word}`} word={word} wordIndex={wordIndex}>
                    {(letters, wordOffset) =>
                      letters.map((char, charIndex) => (
                        <Letter key={wordOffset + charIndex} char={char} index={wordOffset + charIndex} />
                      ))
                    }
                  </Word>
                ))}
              </>
            </TypingTestContainer>
          </>
        </CaretContext.Provider>
      </ScreenReaderAlertContext.Provider>
    </TypingTestContext.Provider>
  )
}

function TypingTestContainer({ children }: { children: ReactElement }) {
  const { actions, testtext, states, setText, words } = useContext(TypingTestContext)
  const { setAlerts } = useContext(ScreenReaderAlertContext)
  const inputRef = useRef<HTMLInputElement>(null)
  const { setTyping } = useCaret()

  const handleKey = (key: string) => {
    if (key === 'Escape') {
      setText(getTestWords())
      // actions?.resetTyping()
      return
    }
    if (key === 'Backspace') {
      actions?.deleteTyping(false)
      setTyping && setTyping(true)
      return
    }
    if (key === 'Control') {
      setAlerts([getWords(testtext, (states?.currIndex || 0) + 1)])
    }
    if (key.length === 1) {
      actions?.insertTyping(key)
      setTyping && setTyping(true)
    }
  }

  const onClick = () => inputRef.current?.focus()

  return (
    <div className={'center'} tabIndex={0} role={'textbox'} onClick={onClick}>
      {states?.phase === 2 && (
        <div
          className={'result'}
          style={{ justifyContent: 'center', width: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <span id={'result'} style={{ width: 'fit-content' }}>
            <p style={{ display: 'inline-block' }}>{actions && actions.getDuration() / 1000} Sekunden</p> <br />
            <p style={{ display: 'inline-block' }}>
              Genauigkeit {`${((states.correctChar / states.length) * 100).toFixed(1)}%`}
            </p>{' '}
            <br />
            <p style={{ display: 'inline-block' }}>
              Wörter pro Minute {`${(actions && words.length / (actions.getDuration() / 1000 / 60))?.toFixed(1)}`}
            </p>{' '}
            <br />
            <br />
            <button onClick={() => setText(getTestWords())} aria-label={'Neuen Test beginnen'}>
              Neuen Test beginnen
            </button>
          </span>
        </div>
      )}
      {states?.phase !== 2 && (
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
