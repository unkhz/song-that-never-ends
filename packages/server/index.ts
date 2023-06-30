import { serve } from 'bun'
import { getEnv } from 'tools'
import song from 'song'
import { say } from 'speech'
import { sing } from './lib/sing'

const { SERVER_PORT, SPEECH_VOICE, SPEECH_RATE } = getEnv()

const typingDelay =
  SPEECH_VOICE.toLowerCase() === 'good news' ? SPEECH_RATE * 2 : SPEECH_RATE

const stream = () =>
  new ReadableStream({
    type: 'direct',
    async pull(controller) {
      for await (const char of sing(song, typingDelay)) {
        if (char.startsWith('say:')) {
          say(char.slice(4), SPEECH_RATE, SPEECH_VOICE).then((filename) => {
            controller.write(`play:${filename}` + '\n')
            controller.flush()
          })
        } else {
          controller.write(char + '\n')
          controller.flush()
        }
      }
      controller.close()
    },
  })

serve({
  port: SERVER_PORT,
  fetch(req) {
    if (req.url.includes('audio')) {
      const filename = req.url.split('/').pop()
      return new Response(Bun.file(`audio/${filename}`).stream())
    }
    return new Response(stream(), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Private-Network': 'true',
      },
    })
  },
})
