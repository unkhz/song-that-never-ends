import song from './song'
import { sing } from './lib/sing'
import { argv } from 'process'
import { wait } from './lib/tools'

const [_, __, voice = 'Daniel'] = argv

const speechRate = 80
const typingDelay = voice.toLowerCase() === 'good news' ? 160 : 80

async function play(filename: string) {
  await wait(10)
  await Bun.spawn(['afplay', filename]).exited
}

for await (const char of sing(song, voice, speechRate, typingDelay)) {
  if (char.endsWith('.aiff')) {
    play(char)
  } else {
    process.stdout.write(char)
  }
}
