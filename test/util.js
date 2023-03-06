import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import * as util from '../src/util.js'
import * as testData from './data.js'
import { processTokens } from '../src/process.js'
import path from 'node:path'
import drnm from 'drnm'

const test = suite('util')

test('requireTokens throws', () => {
  const tokens = processTokens({ ...testData.deepTree, token: 'defs' })
  assert.throws(() => util.requireTokens(tokens, ['i-should-throw']), 'required token')
})

test('requireTokens does not throw', () => {
  const tokens = processTokens({ ...testData.deepTree, token: 'defs' })
  assert.not.throws(() => util.requireTokens(tokens, ['foo-bar-baz']))
})

test('mergeTree simple', () => {
  const result = util.mergeTree(testData.basicTree)
  assert.equal(result, { 'foo-bar-baz': 'biz' })
})


test('mergeTree underscore ignored', () => {
  assert.equal(util.mergeTree(testData.deepTree), {
    'foo-bar-baz': 'biz',
    'foo': 'maybe',
    'foo-wombat': 'llama',
    'foo-platypus': 'alpaca'
  })
  assert.equal(util.mergeTree(testData.flatTree), util.mergeTree(testData.deepTree))
})

test('toCSS', () => {
  assert.is(util.toCSSMap(['foo', 'bar']), '--w-foo: var(--w-bar);')
  assert.is(util.toCSSDef(['foo', 'bar']), '--w-foo: bar;')
})

test('read yaml', () => {
  const __dirname = drnm(import.meta.url)
  const json = util.readYaml(path.join(__dirname, './fixture.yaml'))
  assert.equal(json, {
    "hello": "world",
    "nested": {
      "object": "here"
    }
  })
})

test.run()
