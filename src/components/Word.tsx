import React, { useContext } from 'react'
import { getWordOffset } from '../utils'
import { TypingTestContext } from './Type'

export default function Word({
  children,
  word,
  wordIndex,
}: {
  children(letters: string[], wordOffset: number): React.ReactElement[]
  word: string
  wordIndex: number
}) {
  const { words } = useContext(TypingTestContext)
  const offset = getWordOffset(words, wordIndex)
  return <span>{children(Array.from(word).concat(['\u00A0']), offset)}</span>
}
