import { withKeys } from '@Utils/ObjectUtils.js';
import Vector from '@Utils/Svg/SvgVector.js';

/**
 * Represents an instrument in the stageplan
 */
export default class Instrument {
  constructor(name, id, type, geometry = { rotation: 0, translation: new Vector(), scale: 1 }) {
    this.name = name;
    this.id = id;
    this.type = type;
    this.geometry = geometry;
    this.linkedTo = new Set();
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

  addLinkedElement(elem) {
    this.linkedTo.add(elem);
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
