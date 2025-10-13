import { defineConfig } from 'rolldown'
import pkg from './package.json' with { type: 'json' }
import { dts } from 'rolldown-plugin-dts'

const external = new RegExp(
  `^(node:|${[...Object.getOwnPropertyNames(pkg.devDependencies ? pkg.devDependencies : []), ...Object.getOwnPropertyNames(pkg.dependencies ? pkg.dependencies : [])].join('|')})`
)

const config = {
  input: './src/index.ts'
}

const cliConfig = {
  input: './src/cli.ts'
}

export default defineConfig([
  {
    ...config,
    output: [
      {
        file: 'lib/index.mjs',
        format: 'es',
        minify: true,
        exports: 'named'
      }
    ],
    external: external
  },
  {
    ...config,
    output: [
      {
        file: 'lib/index.cjs',
        format: 'cjs',
        minify: true,
        exports: 'named'
      }
    ],
    external: external
  },
  {
    ...config,
    output: [
      {
        dir: 'lib',
        format: 'es',
        exports: 'named'
      }
    ],
    plugins: [dts({ emitDtsOnly: true })],
    external: external
  },
  {
    ...cliConfig,
    output: [
      {
        file: 'lib/cli.mjs',
        format: 'esm',
        minify: true
      }
    ],
    external: external
  }
])
