'use strict';

import { expect } from 'chai';
import * as powerglove from '../src';

describe('Utils', () => {

  describe('pipe(value[, ...tasks])', () => {

    it('should iterate a synchronous series', async () => {

      let result = await powerglove.pipe(
        n => 2,
        n => n + 4,
        n => n * 7
      );
      expect(result).to.equal(42);

      async function hello(name) {
        return await powerglove.pipe(
          name,
          greet,
          uppercase,
          exclaim
        );
      }
      let canonicalPhrase = await hello('world')
      expect(canonicalPhrase).to.equal('HELLO, WORLD!');

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
      expect(canonicalPhrase).to.equal('HELLO, WORLD!');

    });

  });

});


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
