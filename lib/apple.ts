import { wait } from './tools'

export async function say(line: string, rate: number, voice: string) {
  await wait(10)
  Bun.spawn(['say', `-v${voice}`, `-r${rate}`, `"\n${line}"`])
}
