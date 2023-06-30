import { play, say } from 'packages/speech'
import { getEnv } from 'tools'
// import { say, play } from 'speech'

const {
  SERVER_HOST = '127.0.0.1',
  SERVER_PORT = 3000,
  SPEECH_RATE = 80,
  SPEECH_VOICE = 'Good news',
} = getEnv()

const response = await fetch(`http://${SERVER_HOST}:${SERVER_PORT}`)

if (response.body) {
  // This does not work properly in Bun 0.6.12
  for await (const chunk of response.body) {
    const char = new TextDecoder().decode(chunk).slice(0, -1)
    if (char.startsWith('say:')) {
      say(char.slice(4), SPEECH_RATE, SPEECH_VOICE).then(play)
    } else {
      process.stdout.write(char)
    }
  }
}
