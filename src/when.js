import curry from './curry';

/**
 * Tests a value and executes either the pass or fail callback
 * @param  {Function} expect    Accepts param `x` and returns `true` or `false`
 * @param  {Function} pass      Accepts param `x` and returns any value. Called if expect returns `true`
 * @param  {Function} fail=x=>x Accepts param `x` and returns any value. Called if expect returns `false`
 * @param  {*}        x         Any value
 * @return {Promise}            Fulfills return value of `pass` or `fail`
 */
async function when(test, pass, fail=x=>x, x) {
  return await test(x)
    ? await pass(x)
    : await fail(x);
}

export default curry(when);
