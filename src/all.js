import curry from './curry';

/**
 * Executes an array of functions concurrently; Returns an array of fulfilled values
 * @param  {[Function]} funcs Array of functions
 * @param  {*}          x     Any value
 * @return {Promise}          Fulfills with array of values returned from resolved tasks
 */
async function all(funcs, x) {
  return await* Array.from(funcs, f => f(x));
}

export default curry(all);
