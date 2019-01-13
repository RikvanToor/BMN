import { isString } from '@Utils/TypeChecks.js';

const predefColors = {
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
  black: '#000000',
  white: '#FFFFFF',
};

const LOOKUP = ['A', 'B', 'C', 'D', 'E', 'F'];

function hexCharToInt(char) {
  const c = char.toUpperCase();
  if (c >= '0' && c <= '9') {
    return parseInt(c);
  }
  return 10 + c.charCodeAt(0) - 'A'.charCodeAt(0);
}

function between(val, start, end) {
  return start <= val && val <= end;
}

/**
 * Converts a small integer to a hex character
 * @param {integer} val Value in [0,15]
 */
function intToHexChar(val) {
  if (val >= 0 && val < 10) return `${val}`;
  return LOOKUP[val - 10];
}

/**
 * Converts a byte to a two character hex string
 * @param {integer} byteVal Value in [0, 255]
 */
function byteToHex(byteVal) {
  const high = Math.floor(byteVal / 16);
  const low = byteVal - high * 16;
  return intToHexChar(high) + intToHexChar(low);
}

function hexByteToInt(byte) {
  const byteStr = byte.toUpperCase();
  return hexCharToInt(byteStr[0]) * 16 + hexCharToInt(byteStr[1]);
}

export default class Color {
  constructor(r, g, b, intBased = true) {
    this.data = [r, g, b];
    this.intBased = intBased;
  }

  static fromData(data, intBased = true) {
    return new Color(data[0], data[1], data[2], intBased);
  }

  get r() {
    return this.data[0];
  }

  get g() {
    return this.data[1];
  }

  get b() {
    return this.data[2];
  }

  static clamp(intVal) {
    return Math.max(0, Math.min(255, intVal));
  }

  static fromHex(hex) {
    const hexStr = hex.toUpperCase().substr(1);
    return new Color(
      hexByteToInt(hexStr.substr(0, 2)),
      hexByteToInt(hexStr.substr(2, 2)),
      hexByteToInt(hexStr.substr(4, 2)),
    );
  }

  static preDef(name) {
    return Color.fromHex(predefColors[name]);
  }

  assignIntValues(values) {
    if (this.intBased) {
      this.data = values;
    } else {
      this.data = values.map(val => val / 255.0);
    }
  }

  circularShift(amount) {
    const amt = amount < 0 ? (3 - ((-amount) % 3)) % 3 : amount % 3;
    if (amt === 1) {
      this.data = [this.data[2], this.data[0], this.data[1]];
    } else if (amt === 2) {
      this.data = [this.data[1], this.data[2], this.data[0]];
    }
  }

  /**
   *
   * @param {float} h Hue, in degrees [0, 360]
   * @param {float} s Saturation [0,1]
   * @param {float} l Luminance [0,1]
   */
  static fromHSL(h, s, l) {
    const C = (1 - Math.abs(2 * l - 1)) * s; // Chroma
    const hApos = h / 60;
    const x = C * (1 - Math.abs((hApos % 2) - 1));
    const m = l - C / 2;
    // const hAposMod = hApos % 2;
    // RGB data
    // const data = hAposMod > 1 ? [x, C, 0] : [C, x, 0];
    // const col = Color.fromData(data, false);
    // col.circularShift(Math.floor(hApos/2));
    // col.addConstant(m);
    // return col;

    if (between(hApos, 0, 1)) {
      return new Color(C + m, x + m, m, false);
    }
    if (between(hApos, 1, 2)) {
      return new Color(x + m, C + m, m, false);
    }
    if (between(hApos, 2, 3)) {
      return new Color(m, C + m, x + m, false);
    }
    if (between(hApos, 3, 4)) {
      return new Color(m, x + m, C + m, false);
    }
    if (between(hApos, 4, 5)) {
      return new Color(x + m, m, C + m, false);
    }
    if (between(hApos, 5, 6)) {
      return new Color(C + m, m, x + m, false);
    }
    return new Color(m, m, m, false);
  }

  add(otherCol) {
    this.data = this.data.map((el, ind) => el + otherCol.data[ind]);
  }

  addConstant(c) {
    this.data = this.data.map(el => el + c);
  }

  lighten(intAmt) {
    const rep = this.getIntRepresentation();
    this.assignIntValues(rep.map(val => Color.clamp(val + intAmt)));
  }

  darken(amt) {
    this.lighten(-amt);
  }

  getIntRepresentation() {
    if (this.intBased) return this.data;
    return this.data.map(el => Color.clamp(Math.floor(el * 255)));
  }

  toHex() {
    const intRep = this.getIntRepresentation();
    return `#${byteToHex(intRep[0])}${byteToHex(intRep[1])}${byteToHex(intRep[2])}`;
  }
}
