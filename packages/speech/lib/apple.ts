import { createHash } from 'crypto'
import { stat } from 'node:fs/promises'
import { wait } from 'tools'
import { execChildProcess } from './exec.js'

function getHash(string: string) {
  return createHash('sha256').update(string).digest('hex')
}

async function run(opts: string[]) {
  return execChildProcess(opts.join(' '))
}

async function ensureOutputFolder() {
  await run(['mkdir', '-p', 'audio'])
}

export async function say(line: string, rate: number, voice: string) {
  await ensureOutputFolder()
  const aiffFile = `audio/${getHash(line)}.aiff`
  const mp3File = aiffFile.replace('.aiff', '.mp3')

  if (!(await stat(aiffFile)).isFile()) {
    console.log('Generate', aiffFile)
    await run([
      'say',
      `-v${voice}`,
      `-r${rate}`,
      `"\n${line}"`,
      `-o${aiffFile}`,
    ])
  }

  if (!(await stat(mp3File)).isFile()) {
    console.log('Generate', mp3File)
    await run(['ffmpeg', '-i', aiffFile, mp3File])
  }

  return mp3File
}

export async function play(filename: string) {
  await wait(10)
  await run(['afplay', filename])
}
