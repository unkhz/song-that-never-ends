import { say } from './apple'
import { typeLine } from './tools'

async function sayAndType(line: string, voice: string) {
  const speechRate = 80
  const typingDelay = voice.toLowerCase() === 'good news' ? 160 : 80

  const procPromise = say(line, speechRate, voice)
  await typeLine(line, typingDelay)
  procPromise.then((proc) => setTimeout(() => proc.kill(), 1000))
}

export async function sing(voice: string, part: string) {
  for (const line of part.split('\n')) {
    const trimmedLine = line.trim()
    if (trimmedLine) {
      await sayAndType(line, voice)
    }
  }
  await typeLine('', 80)
}
