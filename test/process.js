import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { processTokens } from '../src/process.js'
import * as testData from './data.js'

const test = suite('process')

test('processTokens - throws', () => {
  assert.throws(() => processTokens(testData.deepTree))
})

test('processTokens - defs', () => {
  const tokens = processTokens({ ...testData.deepTree, token: 'defs' })
  assert.not(tokens.some(token => token.isDark))
  assert.ok(tokens.some(({ css }) => css.includes('--x-foo: maybe;')))
  assert.not(tokens.some(({ css }) => css.includes('--x-foo: var(--x-maybe);')))
})

test('processTokens - maps', () => {
  const tokens = processTokens({ ...testData.deepTree, token: 'maps' })
  assert.not(tokens.some(token => token.isDark))
  assert.not(tokens.some(({ css }) => css.includes('--x-foo: maybe;')))
  assert.ok(tokens.some(({ css }) => css.includes('--x-foo: var(--x-maybe);')))
})

test('processTokens - dark', () => {
  const darkTokens = processTokens({ ...testData.deepTree, token: 'maps', dark: true })
  assert.ok(darkTokens.some(token => token.isDark))

  const lightTokens = processTokens({ ...testData.deepTree, token: 'maps' })
  assert.not(lightTokens.some(token => token.isDark))
})

test.run()
