import german from './static/languages/german.json'

export function getTestWords(amount = 25) {
  const words = []
  for (let i = 0; i < amount; i++) {
    words.push(german.words[Math.floor(Math.random() * german.words.length)])
  }
  return words.join(' ')
}
