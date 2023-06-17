import song from './song'
import { sing } from './lib/sing'
import { argv } from 'process'

const [_, __, voice = 'Daniel'] = argv

for (const part of song()) {
  await sing(voice, part)
}
