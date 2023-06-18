import { firstVerse, secondVerse, thirdVerse } from './verses'
import { choruses } from './choruses'
import { finalChoruses } from './finalChoruses'
import { numberToWords } from '../lib/numbers'

function pickVariation(variations: string[], idx: number) {
  return variations[idx % variations.length]
}

function pickChorus(iteration) {
  // First chorus is iteration one
  const chorusIdx = iteration + 1

  const numberAsWords = numberToWords(chorusIdx)
  const iterationWords =
  chorusIdx <= 100 ? `iteration ${numberAsWords}` : numberAsWords
  return choruses[chorusIdx % 100].replace(
    /iteration[^,]+/g,
    iterationWords
  )
}

function* songParts() {
  let iteration = 0
  while (numberToWords(iteration)) {
    const chorus = pickChorus(iteration)

    yield pickVariation(firstVerse, iteration)
    yield chorus
    yield pickVariation(secondVerse, iteration)
    yield chorus
    yield pickVariation(thirdVerse, iteration)
    yield pickVariation(finalChoruses, iteration)
    
    iteration++
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
