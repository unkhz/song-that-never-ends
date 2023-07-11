import { getEnv } from 'tools'
import song, { SongPart } from 'song'
import { say } from 'speech'
import { sing } from './lib/sing.js'
import { createServer } from './lib/server.js'
import { createReadStream } from 'node:fs'
import { TextEncoderStream } from 'node:stream/web'
import { readdir, stat } from 'node:fs/promises'
import { createHash } from 'node:crypto'

const { SERVER_PORT, SPEECH_VOICE, SPEECH_RATE } = getEnv()

async function readRandomMusicFile(cat: string) {
  const files = await readdir(`audio/${cat}`)
  const musicFiles = files.filter((file) => file.endsWith('.mp3'))
  const picked = musicFiles[Math.floor(Math.random() * musicFiles.length)]
  if (picked) {
    return `audio/${cat}/${picked}`
  }
}

const typingDelay =
  SPEECH_VOICE.toLowerCase() === 'good news' ? SPEECH_RATE * 2 : SPEECH_RATE

const stream = new TextEncoderStream()

async function generateLineAudioData(line: string) {
  return say(line, SPEECH_RATE, SPEECH_VOICE)
}

async function getCachedSong(iteration: bigint) {
  const parts = await song(iteration)
  for (const part of parts) {
    await generateLineAudioData(part.content)
  }
  return parts
}

type CategoryConfig = {
  key: string
  duration: number
}
const categories: Record<CategoryConfig['key'], CategoryConfig> = {
  'mellow-electric-piano-and-bass': {
    key: 'mellow-electric-piano-and-bass',
    duration: 25_000,
  },
  'romantic-piano-and-harp': {
    key: 'romantic-piano-and-harp',
    duration: 45_000,
  },
  '8bit-game-music': {
    key: '8bit-game-music',
    duration: 45_000,
  },
}

function pickCategory() {
  const keys = Object.keys(categories)
  const pickedKey = keys[Math.floor(Math.random() * keys.length)]
  return categories[pickedKey]
}

async function run() {
  const writer = stream.writable.getWriter()
  const write = async (line: string) => {
    await writer.ready
    await writer.write(line + '\n')
  }

  let lastMusicTime = 0
  let category = pickCategory()

  for await (const event of sing(getCachedSong, typingDelay)) {
    const now = Date.now()
    switch (event.type) {
      case 'iteration': {
        category = pickCategory()
        console.log(`Iteration ${event.content}, ${category.key}`)
        break
      }
      case 'part': {
        // TODO
        break
      }
      case 'line': {
        generateLineAudioData(event.content).then(async (filename) =>
          write(`play:${filename}` + '\n')
        )
        if (now - lastMusicTime > category.duration) {
          lastMusicTime = now
          readRandomMusicFile(category.key).then(async (filename) => {
            if (filename) {
              await write(`play:${filename}` + '\n')
            }
          })
        }
        break
      }
      case 'char': {
        if (event.content === '\n') {
          writer.ready.then(() => writer.write('<br>' + '\n'))
        } else {
          writer.ready.then(() => writer.write(event.content + '\n'))
        }
      }
    }
  }
  await writer.ready
  writer.close()
}

let keeper = stream.readable
function forkStream() {
  const teed = keeper.tee()
  keeper = teed[0]
  return teed[1]
}

createServer(async (req, res) => {
  if (req.url?.includes('/audio/')) {
    const filename = req.url?.split('/').slice(-2).join('/')
    if ((await stat(`audio/${filename}`)).isFile()) {
      const eTag = createHash('sha1').update(filename).digest('hex')
      if (req.headers['if-none-match'] === eTag) {
        res.statusCode = 304
        res.end()
        return { stream: undefined }
      }
      return {
        stream: createReadStream(`audio/${filename}`),
        headers: {
          'Cache-Control': 'public, max-age=31536000',
          'Last-Modified': new Date().toUTCString(),
          ETag: createHash('sha1').update(filename).digest('hex'),
        },
      }
    }
  }
  return { stream: forkStream() }
}).listen(SERVER_PORT, () => {
  console.log(`Server running at http://127.0.0.1:${SERVER_PORT}/`)
})

run()
