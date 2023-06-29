export async function wait(delay: number) {
  const variance = Math.round(delay * 0.33)
  const naturalDelay =
    delay + (Math.round(variance * 2 * Math.random()) - variance)
  await new Promise((resolve) => setTimeout(resolve, naturalDelay))
}

export async function* type(line: string, delay: number) {
  for (const char of line) {
    await wait(delay)
    yield char
    if (char === ',') {
      await wait(delay * 9)
    }
  }
  await wait(delay * 10)
}

export async function* typeLine(line: string, delay: number) {
  for await (const char of type(line, delay)) {
    yield char
  }
  yield '\n'
}
