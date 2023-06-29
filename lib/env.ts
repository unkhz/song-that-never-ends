import { ZodSchema } from 'zod'
const { decode } = await import('toml-nodejs')

async function readToml(file: string) {
  try {
    const fileContents = await Bun.file(file).text()
    return decode(fileContents)
  } catch (err) {
    return {}
  }
}

export async function getEnv<T extends Record<string, unknown>>(
  schema: ZodSchema<T>
): Promise<T> {
  const env = await readToml('.env.toml')
  const envLocal = await readToml('.env.local.toml')
  return schema.parse({
    ...env,
    ...envLocal,
    ...process.env,
  })
}
