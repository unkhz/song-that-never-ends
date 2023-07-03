import { spawn } from 'child_process'

function exec(command: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args)
    let output = ''
    let errorOutput = ''

    child.stdout.on('data', (data) => {
      output += data
    })

    child.stderr.on('data', (data) => {
      errorOutput += data
    })

    child.on('error', (error) => {
      reject(error)
    })

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(errorOutput))
      } else {
        resolve(output)
      }
    })
  })
}

export async function execChildProcess(
  command: string,
  args: string[]
): Promise<string> {
  try {
    const result = await exec(command, args)
    return result
  } catch (error) {
    console.error(`exec error: ${error}`)
    throw error
  }
}
