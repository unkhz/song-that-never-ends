import { describe, expect, it, spyOn } from 'bun:test'
import { sing } from './sing'

describe('sing', () => {
  it('should sing', async () => {
    const song = async (i: bigint) => [`iteration ${i}`, 'la', 'laa']
    const chars = []
    let i = 0
    for await (const char of sing(song, 0, 0)) {
      chars.push(char)
      if (i++ > 42) break
    }
    expect(chars).toEqual([
      'say:iteration 0',
      ...'iteration 0'.split(''),
      '\n',
      'say:la',
      ...'la'.split(''),
      '\n',
      'say:laa',
      ...'laa'.split(''),
      '\n',
      'say:iteration 1',
      ...'iteration 1'.split(''),
      '\n',
      'say:la',
      ...'la'.split(''),
      '\n',
      'say:laa',
      ...'laa'.split(''),
      '\n',
    ])
  })
})
