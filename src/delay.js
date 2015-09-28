import curry from './curry';
import sleep from './sleep';

/**
 * Delays execution of a function for specified number of milliseconds
 * @param  {Number}   ms=0  Milliseconds to wait before calling `f`
 * @param  {Function} f     Function to be called after timeout
 * @param  {*}        x     Any value
 * @return {Promise}        Fulfills with value returned by f(x)
 */
async function delay(ms=0, f, x) {
  await sleep(ms);
  return await f(x);
}

export default curry(delay);
