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


  describe('delay(Number)(Function)', () => {
    it('should execute the function after ~300ms',  async () => {
      const timeDiff = delay(300)(ms => Date.now() - ms)
      expect(await timeDiff(Date.now())).to.be.gt(300)
    })
  })

  describe('when(Function)(Function)(Function) -> Promise -> *', async () => {
    const over9000 = when(lvl => lvl > 9000)
      (lvl => `Holy crap! ${lvl}?! THAT'S OVER 9000!`)
      (lvl => `Pffft. ${lvl}? Is that all you got???`)
    it('should go left when true', async () => {
      expect(await over9000(9001)).to.equal(
        `Holy crap! 9001?! THAT'S OVER 9000!`
      )
    })
    it('should go right when false', async () => {
      expect(await over9000(1)).to.equal(
        `Pffft. 1? Is that all you got???`
      )
    })
  })

  describe('tail(Number)(Function) -> Promise -> *', function () {
    this.timeout(30000); // tests may take a while
    it('should return identity when 0 calls are made', async () => {
      const identity = tail(0)(x => 'this should never get hit');
      expect(await identity(10)).to.equal(10);
    })
    it('should play nice with async functions', async () => {
      const minusOne = delay(100)(x => x - 1);
      const minusOneHundred = tail(100)(minusOne);
      expect(await minusOneHundred(0))
        .to
        .equal(-100)
    })
    it('should call a function a hundred thousand times', async () => {
      const addOneHundredThousand = tail(100000)(x => x + 1);
      expect(await addOneHundredThousand(0))
        .to
        .equal(100000)
    })
  })

  describe('all([Function | Promise]) -> Promise -> [*]', () => {
    it('should place all values in an array', async () => {
      const sayHi = all([
        x => `Hello, ${x}!`,
        x => `¡Hola, ${x}!`,
        x => `Bonjour, ${x}!`
      ])
      expect(
        Array.every(
          await sayHi('world'),
          isEqualToValueOf([
            'Hello, world!',
            '¡Hola, world!',
            'Bonjour, world!'
          ])
        )
      ).to.equal(true)
    })
  })

  describe('pipe([Function | Promise]) -> Promise -> *', () => {
    it('should iterate a synchronous sequence', async () => {
      const doWeirdMath = pipe([
        n => n + 4,
        n => n * 7
      ])
      const sayHello = pipe([
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
      const doWeirdMath = pipe([
        delay(100)
          (n => n + 4),
        delay(100)
          (n => n * 7)
      ])
      const sayHello = pipe([
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
