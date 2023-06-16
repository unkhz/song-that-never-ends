function removeIndentation(str: string) {
  return str.replace(/\n\s+/g, "\n");
}

async function wait(delay: number) {
  const variance = Math.round(delay * 0.33);
  const naturalDelay =
    delay + (Math.round(variance * 2 * Math.random()) - variance);
  await new Promise((resolve) => setTimeout(resolve, naturalDelay));
}

async function type(line: string, delay: number) {
  for (const char of line) {
    await wait(delay);
    process.stdout.write(char);
  }
}

async function say(line: string, voice: string) {
  const proc = Bun.spawn(["say", `-v${voice}`, line]);
  await proc.exited;
}

async function sayAndType(line: string, voice: string, delay: number) {
  await Promise.all([type(`${line}\n`, delay), say(line, voice)]);
}

export async function sing(
  voice: string,
  verse1: string,
  verse2: string,
  verse3: string,
  chorus: string,
  finalChorus: string
) {
  const parts = [verse1, chorus, verse2, chorus, verse3, finalChorus];
  for (const part of parts.map(removeIndentation)) {
    for (const line of part.split("\n")) {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        await sayAndType(line, voice, 66);
      }
    }
    await type(`\n`, 11);
  }
  await type(`-------\n`, 66);
}
