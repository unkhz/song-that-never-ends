import { Configuration, CreateChatCompletionRequest, OpenAIApi } from 'openai'
import { getEnv } from './env'
import z from 'zod'

const openAiEnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(32),
})

const { OPENAI_API_KEY } = await getEnv(openAiEnvSchema)
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
