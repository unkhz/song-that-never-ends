import { argv } from 'process'
import song from 'song'
import { sing } from './lib/sing'
import { play, say } from './lib/apple'

const [_, __, voice = 'Daniel'] = argv

const speechRate = 80
const typingDelay = voice.toLowerCase() === 'good news' ? 160 : 80

for await (const char of sing(song, typingDelay)) {
  if (char.startsWith('say:')) {
    say(char.slice(4), speechRate, voice).then(play)
  } else {
    process.stdout.write(char)
  }
}
