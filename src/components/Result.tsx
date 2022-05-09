import { useContext } from 'react'
import { getTestWords } from '../utils'
import { NewContext } from './Type'
import { CharState } from './useTypingTest'

export function Result() {
  const {
    times: { start, end },
    wordState,
    setText,
  } = useContext(NewContext)

  const durationInSeconds = (end - start) / 1000
  let correctChars = 0
  let incorrectWords = 0
  for (let i = 0; i < wordState.wordCount; i++) {
    const charStates = Object.keys(wordState[i].inputChars).map((key) => wordState[i].inputChars[parseInt(key)].state)
    correctChars += charStates.filter((charState) => charState === CharState.Correct).length
    charStates.includes(CharState.Incorrect) && ++incorrectWords
  }
  const wpm = ((wordState.wordCount - incorrectWords) / (durationInSeconds / 60)).toFixed(1)
  return (
    <div
      className={'result'}
      style={{ justifyContent: 'center', width: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <span id={'result'} style={{ width: 'fit-content' }}>
        <p style={{ display: 'inline-block' }}>{durationInSeconds} Sekunden</p> <br />
        <p style={{ display: 'inline-block' }}>
          Genauigkeit {`${(((correctChars + wordState.wordCount - 1) / wordState.textLength) * 100).toFixed(1)}%`}
        </p>{' '}
        <br />
        <p style={{ display: 'inline-block' }}>Wörter pro Minute {`${wpm}`}</p> <br />
        <br />
        <button
          onClick={() => {
            setText(getTestWords())
          }}
          aria-label={'Neuen Test beginnen'}
        >
          Neuen Test beginnen
        </button>
      </span>
    </div>
  )
}
