import { getEnv } from 'tools'
import song from 'song'
import { say } from 'speech'
import { sing } from './lib/sing.js'
import { createServer } from './lib/server.js'
import { createReadStream } from 'node:fs'
import { TextEncoderStream } from 'node:stream/web'

const { SERVER_PORT, SPEECH_VOICE, SPEECH_RATE } = getEnv()

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

async function run() {
  const writer = stream.writable.getWriter()
  for await (const char of sing(getCachedSong, typingDelay)) {
    await writer.ready
    if (char.startsWith('say:')) {
      generateLineAudioData(char.slice(4)).then((filename) => {
        writer.write(`play:${filename}` + '\n')
      })
    } else if (char === '\n') {
      writer.write('<br>' + '\n')
    } else {
      writer.write(char + '\n')
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

createServer((req) => {
  if (req.url?.includes('/audio/')) {
    const filename = req.url?.split('/').pop()
    return createReadStream(`audio/${filename}`)
  }
  return forkStream()
}).listen(SERVER_PORT, () => {
  console.log(`Server running at http://127.0.0.1:${SERVER_PORT}/`)
})

run()
