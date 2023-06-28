import * as original from './verses'
import { numberToWords } from '../lib/numbers'
import { editVerse } from './edit'

const moods = [
  'eternity',
  'death',
  'spring',
  'light',
  'spirit',
  'human evolution',
  'transcendence',
]
function pickNewMood(): string | undefined {
  if (Math.random() > 0.67) {
    return moods[Math.floor(Math.random() * moods.length)]
  }
}

function changeMood(instruction, mood) {
  return `${instruction} Talk intensely about ${mood}.`
}

async function pickVariation(input: string, mood?: string) {
  const instruction =
    'Input is a verse in a never ending song. Write the next verse for the song and make it rhyme.'
  return editVerse(
    input,
    mood ? changeMood(instruction, mood) : instruction,
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
  const mood = pickNewMood()
  return Promise.all([
    pickChorus(previous.chorus, iteration),
    pickVariation(previous.firstVerse, mood),
    pickVariation(previous.secondVerse, mood),
    pickVariation(previous.thirdVerse, mood),
    pickVariation(previous.finalChorus, mood),
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
