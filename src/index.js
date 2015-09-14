/**
 *
 * Creates a generator that iterates a collection of a/sync functions
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

/**
 *
 * Iterates a series to completion or failure
 *
 * @param  {Function} next  ::series.next
 * @param  {*}        value Argument to pass to `next` function
 * @return {Promise}        fulfills with return value of `next`
 */
export async function execSeries(next, value) {
  let nextVal = await next(value);
  if (!nextVal.done) return (
    await execSeries(next, nextVal)
  );
  return nextVal.value;
}

/**
 *
 * Pipes a value through a series
 *
 * @param  {*}          value The seed value for the pipe
 *                            immediately invoked if instanceof Function
 * @param  {[Function]} tasks An array of functions to pipe `value` through
 * @return {Promise}          Final result of pipe
 */
export async function pipe(value, ...tasks) {
  tasks = tasks.slice();
  let q = series(
    async () => value instanceof Function ? value() : value,
    ...tasks
  );
  return await execSeries(::q.next);
}
