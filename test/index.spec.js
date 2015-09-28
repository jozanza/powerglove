'use strict'

import { expect } from 'chai'
import * as powerglove from '../src'
import {
  all,
  pipe,
  when,
  identity,
  delay,
  sleep,
  until,
  race
} from '../src'

console.log('---------')
console.log(powerglove)
console.log('---------')

describe('Utils', () => {

  describe('race :: [(a -> *)] -> a -> Promise -> *', () => {
    it('should curry', async () => {
      const tasks = [
        delay(0)(x => `a${x}`),
        delay(1)(x => `b${x}`)
      ]
      expect(
        await race(tasks, '!')
      )
      .to.equal(
        await race(tasks)('!')
      )
    })
    it('should resolve the value of the first function to fulfill', async () => {
      const allGone = ([x]) => x <= 0
      const untilAllGone = until(allGone)
      const fastSubtract = untilAllGone(
        ([x, method='a']) => ([x - 1, method])
      )
      const slowSubtract = untilAllGone(
        delay(0)(
          ([x, method='b']) => ([x - 1, method])
        )
      )
      const firstToZero = race([fastSubtract, slowSubtract])

      const fast = delay(200)(x => `${x} Speed Racer!`)
      const faster = delay(100)(x => `${x} Racer X!`)
      const fastest = delay(0)(x => `${x} Chim Chim!`)
      const announceWinner = race([
        fast,
        faster,
        fastest
      ])

      expect((await firstToZero([10]))[1]).to.equal('a')
      expect(await announceWinner('And the winner is...'))
        .to
        .equal(`And the winner is... Chim Chim!`)
    })
  })

  describe('delay :: Number -> (a -> *) -> a -> Promise -> *', () => {
    it('should execute the function after ~300ms', async () => {
      const timeSince = delay(300)(ms => Date.now() - ms)
      expect(await timeSince(Date.now())).to.be.within(300, 310)
    })
  })

  describe('when :: (a -> Bool) -> (a -> *) -> (a -> *) -> a -> Promise -> *', async () => {
    const over9000 = lvl => lvl > 9000
    const praise = lvl => `Holy crap! ${lvl}?! THAT'S OVER 9000!`
    const insult = lvl => `Pffft. ${lvl}? Is that all you got???`
    const analyzePowerLevel = when(over9000)(praise)(insult)
    it('should curry', async () => {
      expect(
        await analyzePowerLevel(1)
      )
      .to.equal(
        await when(over9000, praise, insult, 1)
      )
      expect(
        await analyzePowerLevel(1)
      )
      .to.equal(
        await when(over9000, praise)(insult)(1)
      )
      expect(
        await analyzePowerLevel(1)
      )
      .to.equal(
        await when(over9000)(praise, insult)(1)
      )
    })
    it('should praise when over 9000', async () => {
      expect(await analyzePowerLevel(9001)).to.equal(
        `Holy crap! 9001?! THAT'S OVER 9000!`
      )
    })
    it('should insult when less than 9000', async () => {
      expect(await analyzePowerLevel(1)).to.equal(
        `Pffft. 1? Is that all you got???`
      )
    })
  })

  describe('until(Function)(Function) -> Promise -> *', function () {
    this.timeout(60000); // tests may take a while
    it('should return identity when 0 calls are made', async () => {
      const returnTrue = () => true
      const throwErr = () => { throw new Error() }
      const noop = until(returnTrue)(throwErr);
      expect(await noop(10)).to.equal(10);
    })
    it('should play nice with async functions', async () => {
      const minusminus = delay(10)(x => x - 1)
      const smallEnough = delay(10)(x => x <= 0)
      const subtractAll = until(smallEnough)(minusminus)
      expect(await subtractAll(100)).to.equal(0)
    })
    it('should call a function a ridiculous number of times', async () => {
      const plusplus = x => x + 1
      const largeEnough = x => x >= 100000
      const addALot = until(largeEnough)(plusplus)
      expect(await addALot(0)).to.equal(100000)
    })
  })

  describe('all :: [(a -> *)] -> a -> Promise -> [*]', () => {
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
