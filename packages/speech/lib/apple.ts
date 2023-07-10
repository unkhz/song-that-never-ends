import { createHash } from 'crypto'
import { stat } from 'node:fs/promises'
import { wait } from 'tools'
import { execChildProcess } from './exec.js'

function getHash(string: string) {
  return createHash('sha256').update(string).digest('hex')
}

async function ensureOutputFolder() {
  await execChildProcess('mkdir', ['-p', 'audio/voice'])
}

async function fileExists(file: string) {
  try {
    return (await stat(file)).isFile()
  } catch (error) {
    return false
  }
}

export async function say(line: string, rate: number, voice: string) {
  await ensureOutputFolder()
  const aiffFile = `audio/voice/${getHash(`${voice},${rate},${line}`)}.aiff`
  const mp3File = aiffFile.replace('.aiff', '.m4a')

  if (!(await fileExists(mp3File))) {
    if (!(await fileExists(aiffFile))) {
      await execChildProcess('say', [
        '-v',
        voice,
        '-r',
        `${rate}`,
        '-o',
        aiffFile,
        `"${line}"`,
      ])
    }

    await execChildProcess('ffmpeg', [
      '-i',
      aiffFile,
      '-c:a',
      'aac',
      '-b:a',
      '32k',
      mp3File,
    ])

    //await execChildProcess('rm', [aiffFile]).catch(() => {})
  }

  return mp3File
}

export async function play(filename: string) {
  await wait(10)
  await execChildProcess('afplay', [filename])
}
