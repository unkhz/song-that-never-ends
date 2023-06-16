function removeIndentation(str: string) {
  return str.replace(/\n\s+/g, '\n')
}

async function type(line: string, delay: number) {
  for (const char of line) {
    await new Promise((resolve) => setTimeout(resolve, delay))
    process.stdin.write(char)
  }
}

async function sayAndType(line: string, delay: number) {
  const proc = Bun.spawn(['say', '-vDaniel', line])
  await type(`${line}\n`, delay)
  await proc.exited
}

export async function sing(
  verse1: string,
  verse2: string,
  verse3: string,
  chorus: string,
  finalChorus: string
) {
  const parts = [verse1, chorus, verse2, chorus, verse3, finalChorus]
  for (const part of parts.map(removeIndentation)) {
    for (const line of part.split('\n')) {
      const trimmedLine = line.trim()
      if (trimmedLine) {
        await sayAndType(line, 66)
      }
    }
    await type(`\n`, 11)
  }
  await type(`-------\n`, 66)
}
