import * as original from './verses'
import { numberToWords } from '../lib/numbers'
import { editVerse } from './edit'

async function pickVariation(input: string, iteration: bigint) {
  return editVerse(
    input,
    'Input is a verse in a never ending song. Write the next verse for the song and make it rhyme.',
    1.2
  )
}

async function pickChorus(chorus: string, iteration: bigint) {
  const chorusIdx = iteration + 1n
  const numberAsWords = numberToWords(chorusIdx)
  const iterationInstruction =
    chorusIdx <= 100 ? '' : ' Remove the word "iteration".'
  return editVerse(
    chorus,
    `Change the number on first line to "${numberAsWords}".${iterationInstruction} Vary second line so that it rhymes with the first line. Change words of third line, but keep the tone. Vary fourth line, so that it rhymes with the third line.`,
    1
  )
}

function deIndent(part: string) {
  const lines = part.split('\n')
  return lines.map((line) => line.replace(/^\s+/, '')).join('\n')
}

const previous = {
  firstVerse: original.firstVerse,
  secondVerse: original.secondVerse,
  thirdVerse: original.thirdVerse,
  chorus: original.chorus,
  finalChorus: original.finalChorus,
}

async function generateIteration(iteration: bigint) {
  if (iteration === 0n) {
    return [
      deIndent(original.chorus),
      deIndent(original.firstVerse),
      deIndent(original.secondVerse),
      deIndent(original.thirdVerse),
      deIndent(original.finalChorus),
    ]
  }
  return Promise.all([
    pickChorus(previous.chorus, iteration),
    pickVariation(previous.firstVerse, iteration),
    pickVariation(previous.secondVerse, iteration),
    pickVariation(previous.thirdVerse, iteration),
    pickVariation(previous.finalChorus, iteration),
  ])
}

export default async function song(iteration: bigint) {
  const [chorus, firstVerse, secondVerse, thirdVerse, finalChorus] =
    await generateIteration(iteration)

  Object.assign(previous, {
    chorus,
    firstVerse,
    secondVerse,
    thirdVerse,
    finalChorus,
  })

  return [firstVerse, chorus, secondVerse, chorus, thirdVerse, finalChorus]
}
