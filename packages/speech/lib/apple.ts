import { createHash } from 'crypto'
import { wait } from 'tools'

function getHash(string: string) {
  return createHash('sha256').update(string).digest('hex')
}

async function run(opts: string[]) {
  return Bun.spawn(opts).exited
}

await run(['mkdir', '-p', 'audio'])

export async function say(line: string, rate: number, voice: string) {
  const aiffFile = `audio/${getHash(line)}.aiff`
  const mp3File = aiffFile.replace('.aiff', '.mp3')

  if (!Bun.file(aiffFile).size) {
    console.log('Generate', aiffFile)
    await run([
      'say',
      `-v${voice}`,
      `-r${rate}`,
      `"\n${line}"`,
      `-o${aiffFile}`,
    ])
  }

  if (!Bun.file(mp3File).size) {
    console.log('Generate', mp3File)
    await run(['ffmpeg', '-i', aiffFile, mp3File])
  }

  return mp3File
}

export async function play(filename: string) {
  await wait(10)
  await Bun.spawn(['afplay', filename]).exited
}
