import { firstVerse, secondVerse, thirdVerse } from './verses'
import { choruses } from './choruses'
import { finalChoruses } from './finalChoruses'
import { numberToWords } from '../lib/numbers'

function pickVariation(variations: string[], idx: number) {
  return variations[idx % variations.length]
}

function pickChorus(iteration) {
  const chorusIdx = iteration + 1

  const numberAsWords = numberToWords(chorusIdx)
  const iterationWords =
    chorusIdx <= 100 ? `iteration ${numberAsWords}` : numberAsWords
  return choruses[iteration % 100].replace(/iteration[^,]+/g, iterationWords)
}

function deIndent(part: string) {
  const lines = part.split('\n')
  return lines.map((line) => line.replace(/^\s+/, '')).join('\n')
}

export default function song(iteration) {
  const chorus = pickChorus(iteration)

  return [
    pickVariation(firstVerse, iteration),
    chorus,
    pickVariation(secondVerse, iteration),
    chorus,
    pickVariation(thirdVerse, iteration),
    pickVariation(finalChoruses, iteration),
  ].map(deIndent)
}
