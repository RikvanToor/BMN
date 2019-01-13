import { Record, List, Map } from 'immutable';
import { intRange } from '@Utils/Ranges.js';

export default class Stageplan extends Record(
  {
    id: -1, name: '', year: 1980, elements: new Map(), roles: new List(), positions: new List(), ordering: []
  },
) {
  addPosition(position) {

  }

  addRole(role) {

  }

  addElement(element) {
    return this.setIn(['elements', element.id], element);
  }

  getElement(id) {
    return this.getIn(['elements', id]);
  }

  /**
   * Returns a range of integers with indices of the sorted elements. 
   * @param {List} listOfElements List of stageplan elements to sort. Uses the orderNum property
   */
  static orderFor(listOfElements) {
    const range = intRange(0, listOfElements.length);
    range.sort((a, b) => {
      return a.orderNum < b.orderNum;
    });
    return range;
  }
}
