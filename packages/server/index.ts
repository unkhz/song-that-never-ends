import { getEnv } from 'tools'
import song from 'song'
import { say } from 'speech'
import { sing } from './lib/sing.js'
import { createServer } from './lib/server.js'
import { createReadStream } from 'node:fs'
import { TextEncoderStream } from 'node:stream/web'
import { readdir, stat } from 'node:fs/promises'

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
  const lines = await song(iteration)
  for (const line of lines) {
    await generateLineAudioData(line)
  }
  return lines
}

let musicStep = 0
async function run() {
  const writer = stream.writable.getWriter()
  for await (const char of sing(getCachedSong, typingDelay)) {
    if (char.startsWith('say:')) {
      generateLineAudioData(char.slice(4)).then(async (filename) => {
        await writer.ready
        await writer.write(`play:${filename}` + '\n')
      })
    } else if (char === '\n') {
      writer.ready.then(() => writer.write('<br>' + '\n'))
    } else {
      writer.ready.then(() => writer.write(char + '\n'))
    }

    const now = Date.now()
    if (now - musicStep > 7000) {
      musicStep = now
      readRandomMusicFile('ambience').then(async (filename) => {
        if (filename) {
          await writer.ready
          await writer.write(`play:${filename}` + '\n')
        }
      })
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
      return createReadStream(`audio/${filename}`)
    }
  }
  return forkStream()
}).listen(SERVER_PORT, () => {
  console.log(`Server running at http://127.0.0.1:${SERVER_PORT}/`)
})

run()
