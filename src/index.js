// ----------
// Generators
// ----------

/**
 *
 * Creates a generator that iterates a collection of a/sync functions
 * Does not allow multiple functions to run concurrently
 *
 * @param  {[Function]} tasks Collection of functions to be called in sequence
 * @return {Generator}        Series -- collection iterator
 */
export async function *series(...tasks) {
  let value;
  tasks = tasks.slice();
  while (tasks.length) (
    { value } = yield (
      await tasks.shift()(value)
    )
  );
  return value;
}

// ---------
// Iterators
// ---------

/**
 *
 * Iterates a series to completion or failure
 * Pipes return from previous function into next
 *
 * @param  {Function} next  ::series.next
 * @param  {*}        value Argument to pass to `next` function
 * @return {Promise}        fulfills with return value of `next`
 */
export async function pipeSeries(next, value) {
  let nextVal = await next(value);
  if (!nextVal.done) return (
    await pipeSeries(next, nextVal)
  );
  return nextVal.value;
}

// -----
// Utils
// -----

/**
 *
 * Pipes a value through a series
 *
 * @param  {*}          value The seed value for the pipe
 *                            immediately invoked if instance of Function
 * @param  {[Function]} tasks An array of functions to pipe `value` through
 * @return {Promise}          Final result of pipe
 */
export async function pipe(value, ...tasks) {
  // @todo throw error
  const S = series(
    async () => value instanceof Function ? value() : value,
    ...tasks.slice()
  );
  return await pipeSeries(::S.next);
}

export async function all(...tasks) {
  return await* Array.from(tasks, task => task());
}

export function identity(x) {
  return x;
}

export async function lazyIdentity(x) {
  return await x;
}

export function getProp(key){
  return async obj => obj[key];
}

export function ternary(expect, _then, _else) {
  return async value => await expect(value)
    ? _then(value)
    : _else(value);
}

export function trace(x){
  return !console.log(x)
    ? x
    : 'this will never happen :)';
}
