import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { treeshake } from '../src/treeshake.js'
import * as testData from './data.js'
import { processTokens } from '../src/process.js'

const test = suite('treeshake')

test('it shakes', () => {
  const presentTokens = processTokens({ ...testData.basicTreeFull, token: 'defs' })
  const maps = processTokens({ ...testData.shakeMap, token: 'maps' })
  const combined = [...presentTokens, ...maps]
  const shaken = treeshake(combined)
  assert.is(combined.length, 5)
  assert.is(shaken.length, 2)
})

test.run()
