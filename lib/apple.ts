import { createHash } from 'crypto'

function getHash(string: string) {
  return createHash('sha256').update(string).digest('hex')
}

async function run(opts: string[]) {
  return Bun.spawn(opts).exited
}

await run(['mkdir', '-p', 'audio'])

export async function say(line: string, rate: number, voice: string) {
  const filename = `audio/${getHash(line)}.aiff`
  if (Bun.file(filename).size) {
    return filename
  }

  await run(['say', `-v${voice}`, `-r${rate}`, `"\n${line}"`, `-o${filename}`])

  return filename
}
