/**
 * Fulfills a promise after specified number of milliseconds
 * @param  {Number}  ms=0  Milliseconds to wait
 * @return {Promise}       Fulfills after specified ms
 */
export default async function sleep(ms=0) {
  return new Promise(fulfill => {
    setTimeout(fulfill, ms);
  });
}
