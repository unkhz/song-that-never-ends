import song from './song'
import { sing } from './lib/sing'
import { argv } from 'process'

const [_, __, voice = 'Daniel'] = argv

// After decillion iterations, start over again. What else can you do?
// According to Wikipedia (https://en.wikipedia.org/wiki/Names_of_large_numbers),
// numbers after decillion are not widely standardized, so it's perhaps the
// best time to start over.
const loopLength = 1_000_000_000_000_000_000_000_000_000_000_000_000_000_000n

// TODO, persist
let currentIteration = 0n

async function singParts(parts: string[], iteration: bigint) {
  if (iteration < loopLength) {
    for (const part of parts) {
      await sing(voice, part)
    }
  } else {
    currentIteration = 0n
  }
}

let iteration = 0n
let ended = false
let nextParts: string[]
while (!ended) {
  const parts = nextParts ?? (await song(iteration))
  const singingPromise = singParts(parts, iteration)
  iteration++
  nextParts = await song(iteration)
  await singingPromise
}
