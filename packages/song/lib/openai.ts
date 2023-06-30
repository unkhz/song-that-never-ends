import { Configuration, OpenAIApi } from 'openai'
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
