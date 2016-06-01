import curry from './curry';

/**
 * Executes an array of functions concurrently; Returns an array of fulfilled values
 * @param  {Function[]} funcs   Array of functions
 * @param  {*}          ...args Any set of values
 * @return {Promise}            Fulfills with array of values returned from resolved tasks
 */
async function all(funcs, ...args) {
  return Promise.all(Array.from(funcs, f => f(...args)));
}

export default curry(all);
