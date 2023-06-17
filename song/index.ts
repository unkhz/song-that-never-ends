import { firstVerse, secondVerse, thirdVerse } from './verses'
import { choruses } from './choruses'
import { finalChoruses } from './finalChoruses'
import { numberToWords } from '../lib/numbers'

function pickVariation(variations: string[], idx: number) {
  return variations[idx % variations.length]
}

function* songParts() {
  let num = 1
  while (numberToWords(num)) {
    const numberAsWords = numberToWords(num)
    const iterationWords =
      num <= 100 ? `iteration ${numberAsWords}` : numberAsWords
    const chorus = choruses[num % 100].replace(
      /iteration[^,]+/g,
      iterationWords
    )
    yield pickVariation(firstVerse, num)
    yield chorus
    yield pickVariation(secondVerse, num)
    yield chorus
    yield pickVariation(thirdVerse, num)
    yield pickVariation(finalChoruses, num)
    num++
  }
}

export default function* song() {
  for (const part of songParts()) {
    yield part
      .split('\n')
      .map((line) => line.trim())
      .join('\n')
  }
}
