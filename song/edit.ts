import { openai } from '../lib/openai'
import { wait } from '../lib/tools'

export async function editVerse(
  input: string,
  instruction: string,
  temperature: number
) {
  let i = 0
  while (i < 20) {
    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: instruction },
          { role: 'user', content: input },
        ],
        max_tokens: 64,
        temperature,
        top_p: 1,
      })
      if (response.status === 200 && response.data.choices.length > 0) {
        const verse = response.data.choices[0].message.content
          .split('\n')
          .slice(0, 4)
          .map((line) => line.trim())

        // reject verses that are changing the song too much
        if (
          verse.length === 4 &&
          verse.every((line) => line.length > 15) &&
          verse.every((line) => line.length < 81) &&
          verse.every(
            (line) => !line.toLowerCase().includes(instruction.toLowerCase())
          )
        ) {
          return verse
            .join('\n')
            .replaceAll('<br>', '')
            .replaceAll('<br/>', '')
            .replace(/^#+/g, '')
        }
      }
    } catch (err) {
      //console.error(err)
    }

    // try again in a bit
    await wait(Math.min(10000, 100 + Math.pow(2, i)))
  }

  throw new Error('Failed to generate verse')
}
