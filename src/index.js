// ----------
// Generators
// ----------

/**
 *
 * Creates a generator that iterates a collection of a/sync functions
 * Does not allow multiple functions to run concurrently
 *
 * @param  {[Function]} tasks Collection of functions to be called in sequence
 * @return {Generator}        Sequence -- collection iterator
 */
export async function *sequence(tasks) {
  let value;
  let _tasks = tasks.slice();
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
 * Iterates a sequence to completion or failure
 * Pipes return from previous function into next
 *
 * @param  {Function} next  ::sequence.next
 * @param  {*}        value Argument to pass to `next` function
 * @return {Promise}        fulfills with return value of `next`
 */
export async function pipeSequence(next, value) {
  let nextVal = await next(value);
  if (!nextVal.done) return (
    await pipeSequence(next, nextVal)
  );
  return nextVal.value;
}

// -----
// Utils
// -----

/**
 *
 * Pipes a value through a sequence
 *
 * @param  {*}          value The seed value for the pipe
 *                            immediately invoked if instance of Function
 * @param  {[Function]} tasks An array of functions to pipe `value` through
 * @return {Promise}          Final result of pipe
 */
export function pipe(tasks=[]) {
  // @todo throw errors
  return async x => {
    const S = sequence([() => x, ...tasks]);
    return await pipeSequence(::S.next);
  };
}

export function all(tasks=[]) {
  return async x =>  await* Array.from(tasks, task => task(x));
}

export function unary(f) {
  return (...args) => x => f(x, ...args);
}

export function partial(numArgs=1) {
  return f => (...args) => (..._args) => {
    return f(..._args.slice(0, numArgs).concat(...args));
  };
}

export function compose(f, g) {
  return async (...args) => await f(await g(...args));
}

export async function sleep(ms=0) {
  return new Promise(fulfill => {
    setTimeout(fulfill, ms);
  });
}

// delay :: Number -> (...a -> b)
export function delay(ms=0) {
  // for some reason async arrow fn
  // does not await f(...args)
  // but normal async function does
  return f => async function (...args) {
    await sleep(ms);
    return await f(...args);
  };
}

export function identity(x) {
  return x;
}

export function repeat(f, num) {
  return async () => {
    if (num <= 0) return;
    await f();
    return await repeat(f, --num)();
  };
}

export async function trampoline(f) {
  while (f && typeof f === 'function')
    f = await f();
  return f;
}

export function tail(num) {
  return f => async () => await trampoline(await repeat(f, num)());
}

// typeOf :: String -> (a -> Bool)
export function typeOf(type) {
  return x => {
    if (typeof x === type) return x;
    throw new TypeError(
      `Error: ${type} expected, given ${typeof x}`
    );
  };
}

export function resolve(f) {
  return async (...args) => await f(...args);
}

// when :: (a -> Bool) -> (a -> b) -> (a -> c)
export function when(expect) {
  return (okay) =>
    (nope=identity) =>
      async value => await expect(value)
        ? await okay(value)
        : await nope(value);
}

export function trace(x){
  return !console.log(x)
    ? x
    : 'this will never happen :)';
}
