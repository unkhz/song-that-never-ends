const metaUrl = new URL(import.meta.url)
const baseDir = metaUrl.pathname.split('/').slice(0, -1).join('/')

export default {
  transform: {
    '^.+\\.tsx?$': [
      `${baseDir}/jestTransform.js`,
      {
        loader: 'tsx',
        target: 'node16',
      },
    ],
  },
  resolver: 'jest-ts-webcompat-resolver',
}
