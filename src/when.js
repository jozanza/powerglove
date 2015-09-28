import curry from './curry';

/**
 * Tests a value and passes value to either the pass function or the fail function
 * @param  {Function} test          Accepts `x`; returns `true` or `false`
 * @param  {Function} pass          Called with `x` if `test` returns `true`
 * @param  {Function} fail=(a => a) Called with `x` if `test` returns `false`
 * @param  {*}        x             Any value
 * @return {Promise}                Fulfills with value returned by `pass` or `fail`
 */
async function when(test, pass, fail=(a => a), x) {
  return await test(x)
    ? await pass(x)
    : await fail(x);
}

export default curry(when);
