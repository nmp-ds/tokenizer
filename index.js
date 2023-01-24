import { processFile } from './src/process.js'
import { treeshake } from './src/treeshake.js'
import { wrapDarkMedia, rootWrap } from './src/util.js'
import path from 'node:path'
import glob from 'glob'

const getCSS = token => token.css
export default function (folderPath, options = {}) {
  const CWD = process.cwd()
  const realPath = path.join(CWD, folderPath)
  const inputs = glob.sync(`${realPath}/**/*.y?(a)ml`)
  if (!inputs.length) throw `Nothing found at ${realPath} with the suffix .yml or .yaml`

  const tokens = inputs.map(processFile).flat(Infinity)
  const shakenTokens = options.treeshake
    ? treeshake(tokens)
    : tokens
  if (options.requirements?.length) {
    for (const r of options.requirements) {
      if (!shakenTokens.some(t => t.token[0] === r)) throw `Missing required token: '${r}' - in ${realPath}`
    }
  }

  const darkTokens = shakenTokens.filter(t => t.isDark).map(getCSS)
  const normalTokens = shakenTokens.filter(t => !t.isDark).map(getCSS)
  const result = rootWrap(normalTokens.join('\n')) + '\n' + wrapDarkMedia(rootWrap(darkTokens.join('\n')))

  return result
}
