import { processFile } from './src/process.js'
import { treeshake } from './src/treeshake.js'
import { wrapDarkMedia, rootWrap, requireTokens } from './src/util.js'
import path from 'node:path'
import { globSync } from 'glob'

const getCSS = token => token.css
export default function (folderPath, options = {}) {
  const CWD = process.cwd()
  const realPath = path.join(CWD, folderPath)
  const inputs = globSync(`${realPath}/**/*.y?(a)ml`)
  if (!inputs.length) throw `Nothing found at ${realPath} with the suffix .yml or .yaml`

  const tokens = inputs.map(processFile).flat(Infinity)
  const shakenTokens = options.treeshake
    ? treeshake(tokens)
    : tokens
  try {
    requireTokens(shakenTokens, options.requirements)
  } catch (err) {
    console.error(err, `in directory ${realPath}`)
    process.exit(1)
  }

  const darkTokens = shakenTokens.filter(t => t.isDark).map(getCSS)
  const normalTokens = shakenTokens.filter(t => !t.isDark).map(getCSS)
  const result = rootWrap(normalTokens.join('\n')) + '\n' + wrapDarkMedia(rootWrap(darkTokens.join('\n')))

  return result
}
