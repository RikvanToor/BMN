// To be used with svg-react-loader
const R = require('ramda');


module.exports = R.curryN(2, function removeInvisibleElem() {
  if (this.isLeaf && this.key === 'style') {
    if (/display:none/.test(this.node)) {
      this.parent.parent.delete();
    }
  }
});
