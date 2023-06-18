import { firstVerse, secondVerse, thirdVerse } from './verses'
import { choruses } from './choruses'
import { finalChoruses } from './finalChoruses'
import { numberToWords } from '../lib/numbers'

function pickVariation(variations: string[], iteration: bigint) {
  return variations[Number(iteration % BigInt(variations.length))]
}

function pickChorus(iteration: bigint) {
  const chorusIdx = iteration + 1n

  const numberAsWords = numberToWords(chorusIdx)
  const iterationWords =
    chorusIdx <= 100 ? `iteration ${numberAsWords}` : numberAsWords
  return choruses[Number(iteration % 100n)].replace(
    /iteration[^,]+/g,
    iterationWords
  )
}

function deIndent(part: string) {
  const lines = part.split('\n')
  return lines.map((line) => line.replace(/^\s+/, '')).join('\n')
}

export default function song(iteration: bigint) {
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
