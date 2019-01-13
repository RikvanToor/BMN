import { withKeys } from '@Utils/ObjectUtils.js';
import Vector from '@Utils/Svg/SvgVector.js';
import { intRange } from '@Utils/Ranges.js';
import Ordering from '@Utils/Svg/Ordering.js';

/**
 * Represents an instrument in the stageplan
 */
export default class Instrument {
  constructor(name, id, type, geometry = { rotation: 0, translation: new Vector(), scale: 1 }, orderNum = -1) {
    this.name = name;
    this.id = id;
    this.type = type;
    this.geometry = geometry;
    this.orderNum = orderNum;
  }

  /**
   * Returns an Ordering object for the given sequence of instruments that is ordered according to the 'orderNum' field.
   * @param {Sequence} sequenceOfInstruments Immutable sequence of Instrument objects
   * @return Ordering Object with keys 'indToId' with value an array of ID's in order, and a key 'idToind', an object
   * with key the ID and value the index.
   */
  static orderList(sequenceOfInstruments) {
    const instruments = sequenceOfInstruments.toJS();
    const range = intRange(0, sequenceOfInstruments.size);
    range.sort((a, b) => instruments[a].orderNum < instruments[b].orderNum);
    return new Ordering(
      instruments.reduce((accum, val, ind) => {
        accum[val.id] = range[ind];
        return accum;
      }, {}),
      range.map(el => instruments[el].id),
    );
  }

  /**
   * Turns this object into a JSON string
   * @returns string JSON string representing this object.
   */
  serialize() {
    const subObj = withKeys(this, ['name', 'id', 'type', 'geometry']);
    // Acquire linked element id's for serialization
    subObj.linkedTo = Array.from(this.linkedTo).map(el => el.id);
    return JSON.stringify(subObj);
  }

  setGeometry(rotation, scale, translation) {
    this.geometry.rotation = rotation;
    this.geometry.scale = scale;
    this.geometry.translation = translation;
  }

  setGeometryObject(obj) {
    this.geometry = obj;
  }
}
