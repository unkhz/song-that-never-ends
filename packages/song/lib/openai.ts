import { Configuration, CreateChatCompletionRequest, OpenAIApi } from 'openai'
import { getEnv } from 'tools'

const { OPENAI_API_KEY } = getEnv()
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
})

export const openai = new OpenAIApi(configuration)

export async function getChatCompletion(
  options: CreateChatCompletionRequest
): Promise<string> {
  const response = await openai.createChatCompletion(options)
  if (response.status !== 200) {
    throw new Error(
      `Failed to generate verse: ${response.status} ${response.statusText}`
    )
  }
  const [first] = response.data.choices
  if (!first?.message?.content) {
    throw new Error(`No content received in response: ${response.data}`)
  }

  return first.message.content
}
