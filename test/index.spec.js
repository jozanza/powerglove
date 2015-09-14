'use strict';

import { expect } from 'chai';
import * as powerglove from '../src';

describe('Utils', () => {

  describe('pipe(value[, ...tasks])', () => {

    it('synchronous series', async () => {
      let result = await powerglove.pipe(
        n => 2,
        n => n + 4,
        n => n * 7
      );
      expect(result).to.equal(42);
    })

    it('async series', async () => {
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
      expect(result).to.equal(42)
    });

  });

});


async function sleep(ms=0) {
  return new Promise(fulfill => {
    setTimeout(fulfill, ms)
  })
}
