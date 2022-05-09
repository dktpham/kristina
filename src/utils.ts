import german from './static/languages/german.json'

export function getWords(text: string, index: number, nextWordCount?: number): string {
  const word = `${text.substring(0, index).match(/\S*$/)}${text.substring(index).match(/\S*/)}`
  return nextWordCount && index + word.length < text.length
    ? `${word} ${
        nextWordCount && getWords(text, index + word.length + 1, nextWordCount - 1 > 0 ? nextWordCount - 1 : undefined)
      }`
    : word
}

export function getWordOffset(words: string[], wordIndex: number) {
  return wordIndex > 0
    ? words
        .slice(0, wordIndex)
        .map((word) => word.length)
        .reduce((a, b) => a + b, 0) + wordIndex
    : 0
}

export function getTestWords(amount = 25) {
  const words = []
  for (let i = 0; i < amount; i++) {
    words.push(german.words[Math.floor(Math.random() * german.words.length)])
  }
  return words.join(' ')
}
