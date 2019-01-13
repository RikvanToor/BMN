/* eslint-disable import/prefer-default-export */

export function defer(fn) {
  setTimeout(() => {
    fn();
  }, 0);
}
