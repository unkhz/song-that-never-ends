import song from './song'
import { sing } from './lib/sing'
import { argv } from 'process'

const [_, __, voice = 'Daniel'] = argv

// TODO, persist
let currentIteration = 0n

let iteration = 0n
let ended = false
while (!ended) {
  const parts = song(iteration)
  if (parts.length) {
    if (iteration >= currentIteration) {
      for (const part of parts) {
        await sing(voice, part)
      }
    }
  } else {
    // After decillion iterations, start over again. What else can you do?
    // According to Wikipedia (https://en.wikipedia.org/wiki/Names_of_large_numbers),
    // numbers after decillion are not widely standardized, so it's perhaps the
    // best time to start over.
    currentIteration = 0n
  }
  iteration++
}
