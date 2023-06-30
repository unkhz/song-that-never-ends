import { ZodSchema } from 'zod'

export async function getEnv<T extends Record<string, unknown>>(
  schema: ZodSchema<T>,
  env = process.env
): Promise<T> {
  return schema.parse(env)
}
