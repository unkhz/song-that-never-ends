import { say } from './apple'
import { typeLine, wait } from './tools'

async function drain(it: AsyncIterableIterator<unknown>) {
  for await (const _ of it) {
    // just drain it, we don't care about the values
  }
}

async function* singPart(part: string, typingDelay: number) {
  for (const line of part.split('\n')) {
    yield `say:${line}`
    const trimmedLine = line.trim()
    if (trimmedLine) {
      for await (const char of typeLine(line, typingDelay)) {
        yield char
      }
    }
  }
  await wait(typingDelay * 10)
  yield '\n'
  await wait(typingDelay * 10)
}

// After decillion iterations, start over again. What else can you do?
// According to Wikipedia (https://en.wikipedia.org/wiki/Names_of_large_numbers),
// numbers after decillion are not widely standardized, so it's perhaps the
// best time to start over.
const loopLength = 1_000_000_000_000_000_000_000_000_000_000_000_000_000_000n

let iteration = 0n
let ended = false
let nextParts: string[]

export async function* sing(
  song: (iteration: bigint) => Promise<string[]>,
  typingDelay: number
) {
  while (!ended) {
    const parts = nextParts ?? (await song(iteration))

    for (const part of parts) {
      for await (const char of singPart(part, typingDelay)) {
        yield char
      }
    }

    if (iteration < loopLength) {
      iteration++
    } else {
      iteration = 0n
    }

    nextParts = await song(iteration)
  }
}
