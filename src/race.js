import curry from './curry';

/**
 * Executes an array of functions concurrently; Returns value of first function
 * to resolve.
 * @param  {[Function]} funcs Array of functions
 * @param  {*}          x     Any value
 * @return {Promise}          Fulfills with value of first task to complete
 */
async function race(funcs, x) {
  return await Promise.race(Array.from(funcs, f => f(x)));
}

export default curry(race);
