import { useEffect, useState } from 'react'

export enum CharState {
  Correct,
  Incorrect,
  Untouched,
  Additional,
}

export interface WordsState {
  [key: number]: {
    correctChars: string[]
    inputChars: InputChars
  }

  currentWordIndex: number
  currentCharIndex: number
  wordCount: number
  textLength: number
}

export interface InputChars {
  [key: number]: InputChar
}

export interface InputChar {
  char: string
  state: CharState
}

export interface TestTime {
  start: number
  end: number
}

export default function useTypingTest({ words }: { words: string[] }) {
  const [wordState, setWordState] = useState<WordsState>({
    ...words.map((word) => {
      const chars = [...word.split(''), '\u00A0']
      return {
        correctChars: chars,
        inputChars: {
          ...chars.map((char) => ({
            char: char,
            state: CharState.Untouched,
          })),
        },
      }
    }),
    currentWordIndex: 0,
    currentCharIndex: 0,
    wordCount: words.length,
    textLength: words.join(' ').length,
  })

  const [times, setTimes] = useState<TestTime>({ start: 0, end: 0 })

  useEffect(() => {
    setWordState({
      ...words.map((word) => {
        const chars = [...word.split(''), '\u00A0']
        return {
          correctChars: chars,
          inputChars: {
            ...chars.map((char) => ({
              char: char,
              state: CharState.Untouched,
            })),
          },
        }
      }),
      currentWordIndex: 0,
      currentCharIndex: 0,
      wordCount: words.length,
      textLength: words.join(' ').length,
    })
    setTimes({ start: 0, end: 0 })
  }, [words.join(' ')])

  const type = (char: string) => {
    if (times.end > 0) {
      return
    } else {
      times.end === 0 && setTimes({ start: times.start > 0 ? times.start : Date.now(), end: 0 })
    }

    const wordIndex = wordState.currentWordIndex
    const charIndex = wordState.currentCharIndex
    const charState =
      charIndex < wordState[wordIndex].correctChars.length - 1
        ? wordState[wordIndex].correctChars[charIndex] === char ||
          (char === ' ' && wordState[wordIndex].correctChars[wordState[wordIndex].correctChars.length - 1]) === '\u00A0'
          ? CharState.Correct
          : CharState.Incorrect
        : char === ' '
        ? CharState.Untouched
        : CharState.Additional

    const newInputChars: InputChars = {
      ...wordState[wordIndex].inputChars,
      [charIndex]: {
        char: char === ' ' ? wordState[wordIndex].correctChars[charIndex] || '\u00A0' : char,
        state: charState,
      },
    }

    if (charState === CharState.Additional) {
      newInputChars[charIndex + 1] = { char: '\u00A0', state: CharState.Untouched }
    }

    const newCurrentWordIndex = char === ' ' ? wordState.currentWordIndex + 1 : wordState.currentWordIndex
    const newCurrentCharIndex = char === ' ' ? 0 : wordState.currentCharIndex + 1

    setWordState({
      ...wordState,
      [wordIndex]: {
        correctChars: wordState[wordIndex].correctChars,
        inputChars: newInputChars,
      },
      currentWordIndex: newCurrentWordIndex,
      currentCharIndex: newCurrentCharIndex,
    })

    if (wordState.currentWordIndex === words.length - 1 && char === ' ' && times.end === 0) {
      setTimes({ start: times.start > 0 ? times.start : Date.now(), end: Date.now() })
    }
  }

  const backspace = (word?: boolean) => {
    if (times.end > 0) {
      return
    }

    const wordIndex = wordState.currentWordIndex
    const currentWord = wordState[wordIndex]
    let newInputChars: InputChars = currentWord.inputChars

    if (word) {
      newInputChars = {
        ...currentWord.correctChars.map((char) => ({
          char: char,
          state: CharState.Untouched,
        })),
      }
    } else if (Object.keys(currentWord.inputChars).length > Object.keys(currentWord.correctChars).length) {
      delete newInputChars[wordState.currentCharIndex - 1]
    } else if (wordState.currentCharIndex > 0) {
      newInputChars[wordState.currentCharIndex - 1] = {
        char: currentWord.correctChars[wordState.currentCharIndex - 1],
        state: CharState.Untouched,
      }
    }

    setWordState({
      ...wordState,
      [wordIndex]: {
        correctChars: currentWord.correctChars,
        inputChars: newInputChars,
      },
      currentCharIndex: word ? 0 : wordState.currentCharIndex - 1 >= 0 ? wordState.currentCharIndex - 1 : 0,
    })
  }

  return {
    type,
    backspace,
    wordState,
    times,
  }
}
