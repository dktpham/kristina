import React, { useContext } from 'react'
import { Letter } from './Letter'
import { NewContext } from './Type'

export default function Word({ wordIndex }: { wordIndex: number }) {
  const { wordState } = useContext(NewContext)

  return (
    <span>
      {Object.keys(wordState[wordIndex].inputChars).map((chars, charIndex) => (
        <Letter key={`${wordIndex}-${charIndex}`} wordIndex={wordIndex} charIndex={charIndex} />
      ))}
    </span>
  )
}
