// eslint-disable-next-line import/prefer-default-export
export function wrap(val, wrapVal) {
  let v = val;
  while (v < 0) {
    v += wrapVal;
  }
  while (v > wrapVal) {
    v -= wrapVal;
  }
  return v;
}
