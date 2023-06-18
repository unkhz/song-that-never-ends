import { describe, expect, it } from 'bun:test'
import song from '.'

describe('song', () => {
  const iterations = [
    0, 99, 100, 999, 1000, 999_998, 1_000_000, 1_000_101, 1_111_111_111_111,
  ]
  for (const iteration of iterations) {
    it(`should generate iteration ${iteration} of the song`, () => {
      const songParts = song(BigInt(iteration))
      expect(songParts).toMatchSnapshot()
    })
  }
})
