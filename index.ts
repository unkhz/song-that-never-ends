import * as song from './song'
import { numbers } from './lib/numbers'
import { sing } from './lib/sing'

function pickVariation(variations: string[], idx: number) {
  return variations[idx % variations.length]
}

for (let hun = 0; hun < 10; hun++) {
  const { choruses, finalChoruses, firstVerse, secondVerse, thirdVerse } = song
  const chorusesForHundred = hun > 0 ? choruses.slice(1) : choruses
  for (let n = 0; n < chorusesForHundred.length; n++) {
    const chorus =
      hun > 0
        ? chorusesForHundred[n]
            .replace('hundred', '')
            .replace('iteration', `${numbers[hun]} hundred and`)
        : chorusesForHundred[n]

    await sing(
      pickVariation(firstVerse, n),
      pickVariation(secondVerse, n),
      pickVariation(thirdVerse, n),
      chorus,
      pickVariation(finalChoruses, n)
    )
  }
}
