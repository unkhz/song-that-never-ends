import { say } from './apple'
import { typeLine } from './tools'

function removeIndentation(str: string) {
  return str.replace(/\n\s+/g, '\n')
}

async function sayAndType(line: string, voice: string) {
  const speechRate = 80
  const typingDelay = voice.toLowerCase() === 'good news' ? 160 : 80

  await Promise.all([typeLine(line, typingDelay), say(line, speechRate, voice)])
}

export async function sing(
  voice: string,
  verse1: string,
  verse2: string,
  verse3: string,
  chorus: string,
  finalChorus: string
) {
  const parts = [verse1, chorus, verse2, chorus, verse3, finalChorus]
  for (const part of parts.map(removeIndentation)) {
    for (const line of part.split('\n')) {
      const trimmedLine = line.trim()
      if (trimmedLine) {
        await sayAndType(line, voice)
      }
    }
    await typeLine('', 300)
  }
  await typeLine('-------', 66)
}
