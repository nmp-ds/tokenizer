export const basicTree = Object.freeze({
  foo: {
    bar: {
      baz: 'biz'
    }
  }
})

export const basicTreeFull = Object.freeze({
  foo: {
    bar: {
      baz: 'biz',
      animal: 'wombat',
      fruit: 'banana',
      weapon: 'giraffe'
    }
  }
})

export const shakeMap = Object.freeze({
  'omg-wtf-bbq': 'foo-bar-baz'
})

export const flatTree = Object.freeze({
  foo: {
    bar: { baz: 'biz' },
    _: 'maybe',
    wombat: 'llama',
    platypus: 'alpaca'
  }
})

export const deepTree = Object.freeze({
  foo: {
    bar: { baz: 'biz' },
    _: {
      _: 'maybe',
      wombat: 'llama',
      platypus: 'alpaca'
    }
  }
})
