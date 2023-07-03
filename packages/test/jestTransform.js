import { transformSync } from 'esbuild'

const defaultOptions = {
  format: 'cjs',
  sourcemap: 'both',
  target: `node${process.versions.node}`,
}

export default {
  createTransformer(userOptions) {
    return {
      supportsDynamicImport: true,
      supportsStaticESM: true,
      canInstrument: true,
      process(sourceText, sourcePath) {
        const options = {
          ...defaultOptions,
          ...userOptions,
          sourcefile: sourcePath,
        }
        const { code, map } = transformSync(sourceText, options)
        return { code, map }
      },
    }
  },
}
