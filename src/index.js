// ----------
// Generators
// ----------

/**
 *
 * Creates a generator that iterates a collection of a/sync functions
 * Does not allow multiple functions to run concurrently
 *
 * @param  {Function[]} tasks Collection of functions to be called in sequence
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
 * @param  {Function[]} tasks An array of functions to pipe `value` through
 * @return {Promise}          Final result of pipe
 */
export function pipe(tasks=[]) {
  // @todo throw errors
  return async x => {
    const S = sequence([() => x, ...tasks]);
    return await pipeSequence(::S.next);
  };
}

// all :: [(a -> *)] -> a -> Promise -> [*]
export { default as all } from './all';

// race :: [(a -> *)] -> a -> Promise -> *
export { default as race } from './race';

// when :: (a -> Bool) -> (a -> *) -> (a -> *) -> a -> Promise -> *
export { default as when } from './when';

// delay :: Number -> (a -> *) -> a -> Promise -> *
export { default as delay } from './delay';

// sleep :: Number -> Promise -> undefined
export { default as sleep } from './sleep';

// curry :: (* -> a) -> Number -> (* -> a)
export { default as curry } from './curry';

// until :: (a -> Bool) -> (a -> *) -> a -> Promise -> *
export function until(f) {
  return g => async function (...args) {
    return await trampoline(
      await repeat(f)(g)(...args)
    );
  };
}

export async function trampoline(f) {
  while (f && typeof f === 'function')
    f = await f();
  return f;
}

export function repeat(f) {
  return g => async function (value) {
    return await f(value)
      ? value
      : repeat(f)(g)(await g(value));
  };
}

// export function unary(f) {
//   return (...args) => x => f(x, ...args);
// }
//
// export function partial(numArgs=1) {
//   return f => (...args) => (..._args) => {
//     return f(..._args.slice(0, numArgs).concat(...args));
//   };
// }
//
// export function compose(f, g) {
//   return async (...args) => await f(await g(...args));
// }

// export function DOMEvent(name) {
//   return elem => new Promise(fulfill => {
//     function listener (...args) {
//       elem.removeEventListener(name, listener, false);
//       fulfill(...args);
//     }
//     elem.addEventListener(name, listener, false);
//   });
// }

// typeOf :: String -> (a -> Bool)
// export function typeOf(type) {
//   return x => {
//     if (typeof x === type) return x;
//     throw new TypeError(
//       `Error: ${type} expected, given ${typeof x}`
//     );
//   };
// }

// export function resolve(f) {
//   return async (...args) => await f(...args);
// }

// export function trace(x){
//   return !console.log(x)
//     ? x
//     : 'this will never happen :)';
// }
