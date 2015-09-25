'use strict'

import { expect } from 'chai'
import * as powerglove from '../src'
import {
  all,
  pipe,
  unary,
  partial,
  trace,
  when,
  identity,
  sleep,
  delay,
  tail
} from '../src'

console.log('---------')
console.log(powerglove)
console.log('---------')

describe('Utils', () => {

  describe('all([fn])', () => {
    it('should place all values in an array', async () => {
      let count = 0;
      let countToOneThousand = tail(1000)(() => ++count)
      await countToOneThousand()
      let doWeirdMath = all([
        () => 1 * 1,
        () => 2 * 2,
        () => 3 * 3
      ])
      expect(count).to.equal(1000)
      expect(
        Array.every(
          await doWeirdMath(),
          isEqualToValueOf([1, 4, 9])
        )
      ).to.equal(true)
    })
  })

  describe('pipe(value[, [fn]])', () => {
    it('should iterate a synchronous sequence', async () => {
      let doWeirdMath = pipe([
        n => n + 4,
        n => n * 7
      ])
      let sayHello = pipe([
        greet,
        uppercase,
        exclaim,
        when(hasBadWords)
          (chide)
          (),
      ])
      expect(await doWeirdMath(2))
        .to
        .equal(42)
      expect(await sayHello('world'))
        .to
        .equal('HELLO, WORLD!')
      expect(await sayHello('fucker'))
        .to
        .equal(
          '"HELLO, FUCKER!" contains naughty words, '+
          'and you should be ashamed of yourself.'
        )
    })
    it('should iterate an async sequence', async () => {
      let doWeirdMath = pipe([
        delay(100)
          (n => n + 4),
        delay(100)
          (n => n * 7)
      ])
      let sayHello = pipe([
        delay(100)
          (greet),
        delay(100)
          (uppercase),
        delay(100)
          (exclaim),
        delay(100)
          (when(hasBadWords)
            (chide)
            (identity))
      ])
      expect(await doWeirdMath(2)).to.equal(42)
      expect(await sayHello('world')).to.equal('HELLO, WORLD!')
    })
  })

})

function isEqualToValueOf(arr) {
  return (val, i) => val === arr[i]
}
function greet(x) {
  return `Hello, ${x}`
}
function uppercase(x) {
  return x.toUpperCase()
}
function exclaim(x) {
  return `${x}!`
}
function hasBadWords(words) {
  return /bitch|shit|fuck|ass/gi.test(words)
}
async function callEmOut(x) {
  return `"${x}" contains naughty words`
}
async function dropTheMic(x) {
  return `${x}, and you should be ashamed of yourself.`
}
function chide(x) {
  return pipe([
    callEmOut,
    delay(100)
      (dropTheMic)
  ])(x)
}
