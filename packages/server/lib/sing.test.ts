import { SongPart } from 'packages/song/index.js'
import { sing } from './sing.js'

describe('sing', () => {
  it('should sing', async () => {
    const song = async (i: bigint): Promise<SongPart[]> => [
      { type: 'chorus', index: 0, content: `iteration ${i}\nsecond line` },
      { type: 'verse', index: 1, content: 'la la la' },
      { type: 'verse', index: 2, content: 'laa laa laa' },
    ]
    const chars = []
    let i = 0
    for await (const char of sing(song, 0)) {
      chars.push(char)
      if (i++ > 74) break
    }
    expect(chars).toMatchSnapshot()
  })
})
