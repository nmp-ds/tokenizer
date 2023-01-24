import { processFile } from './src/process.js'
import { wrapDarkMedia, rootWrap } from './src/util.js'
import * as lightning from 'lightningcss'
import path from 'node:path'
import glob from 'glob'

const getCSS = token => token.css
export default function (folderPath, options = {}) {
  const CWD = process.cwd()
  const realPath = path.join(CWD, folderPath)
  const inputs = glob.sync(`${realPath}/**/*.y?(a)ml`)
  if (!inputs.length) throw `Nothing found at ${realPath} with the suffix .yml or .yaml`

  const tokens = inputs.map(processFile).flat(Infinity)
  const shakenTokens = tokens // TODO: treeshake

  const darkTokens = shakenTokens.filter(t => t.isDark).map(getCSS)
  const normalTokens = shakenTokens.filter(t => !t.isDark).map(getCSS)
  const result = rootWrap(normalTokens.join('\n')) + '\n' + wrapDarkMedia(rootWrap(darkTokens.join('\n')))

  const { code } = lightning.transform({
    code: Buffer.from(result),
    minify: options.minify ?? true,
    targets: {
      safari: (12 << 16),
      chrome: (80 << 16),
      firefox: (80 << 16),
    }
  })

  return code.toString()
}
