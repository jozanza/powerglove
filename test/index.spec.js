'use strict';

import { expect } from 'chai';
import * as powerglove from '../src';

console.log('---------')
console.log(powerglove);
console.log('---------')

let {
  pipe,
  trace,
  ternary,
  identity
} = powerglove;

describe('Utils', () => {

  describe('all(...tasks)', () => {
    it('should place all values in an array', async () => {
      let result = await powerglove.all(
        () => 1*1,
        () => 2*2,
        () => 3*3
      );
      expect(
        [1, 4, 9].every(isEqualToValueOf(result))
      ).to.equal(true);
    });
  });

  describe('pipe(value[, ...tasks])', () => {
    it('should iterate a synchronous series', async () => {
      let result = await pipe(
        n => 2,
        n => n + 4,
        n => n * 7
      );
      expect(result).to.equal(42);
      async function hello(name) {
        return await pipe(
          name,
          greet,
          uppercase,
          exclaim,
          ternary(
            hasBadWords,
            chide,
            identity
          )
        );
      }
      let canonicalPhrase = await hello('world')
      let naughtyPhrase = await hello('fucker')
      console.log(canonicalPhrase)
      console.log(naughtyPhrase)
      expect(canonicalPhrase).to.equal('HELLO, WORLD!')
    });
    it('should iterate an async series', async () => {
      let result = await powerglove.pipe(
        async (n) => {
          await sleep(100)
          return 2
        },
        async (n) => {
          await sleep(100)
          return n + 4
        },
        async (n) => {
          await sleep(100)
          return n * 7
        },
      );
      expect(result).to.equal(42);
      async function hello(name) {
        return await powerglove.pipe(
          name,
          greetAsync,
          uppercaseAsync,
          exclaimAsync
        );
      }
      let canonicalPhrase = await hello('world')
      expect(canonicalPhrase).to.equal('HELLO, WORLD!')
    });
  });

});

function isEqualToValueOf(arr) {
  return (val, i) => val === arr[i];
}
async function sleep(ms=0) {
  return new Promise(fulfill => {
    setTimeout(fulfill, ms)
  })
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
async function greetAsync(...args) {
  await sleep(100)
  return greet(...args)
}
async function uppercaseAsync(...args) {
  await sleep(100)
  return uppercase(...args)
}
async function exclaimAsync(...args) {
  await sleep(100)
  return exclaim(...args)
}
async function hasBadWords(words) {
  sleep(100);
  return /bitch|shit|fuck|ass/gi.test(words)
}
async function chide(x) {
  return pipe(
    x,
    _x => `"${_x}" contains naughty words`,
    async (_x) => {
      sleep(100);
      return _x += ', and you should be ashamed of yourself.'
    }
  )
}
