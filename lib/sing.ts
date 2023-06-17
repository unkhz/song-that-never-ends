import { say } from './apple'
import { typeLine } from './tools'

async function sayAndType(line: string, voice: string) {
  const speechRate = 80
  const typingDelay = voice.toLowerCase() === 'good news' ? 160 : 80

  await Promise.all([typeLine(line, typingDelay), say(line, speechRate, voice)])
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
