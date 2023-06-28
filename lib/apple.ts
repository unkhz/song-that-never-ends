import { wait } from './tools'

export async function say(line: string, rate: number, voice: string) {
  await wait(10)
  const proc = Bun.spawn(['say', `-v${voice}`, `-r${rate}`, `"\n${line}"`])
  return proc.exited
}
