import { describe, expect, it } from 'bun:test'
import song from '.'

describe('song', () => {
  it('should generate 11 variations of the song', () => {
    let songParts = []
    const iterator = song()
    for (let i = 0; i < 66; i++) {
      songParts.push(iterator.next().value)
    }
    expect(songParts.length).toBe(66)
    expect(songParts).toMatchSnapshot()
  })
})
