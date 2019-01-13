import { throws } from 'assert';

export const OrderActions = {
  PLACE_BEFORE: 0,
  PLACE_AFTER: 1,
  PLACE_FRONT: 2,
  PLACE_BACK: 3,
};

export class OrderAction {
  constructor(type, ids) {
    this.action = 'order';
    this.type = type;
    // Make a copy of the ids
    this.ids = [...ids];
  }
}

export default class Ordering {
  constructor(idToInd, indToId) {
    this.idToInd = idToInd;
    this.indToId = indToId;
    this.length = this.indToId.length;
    console.log(this);
  }

  /**
   * Generates a new Ordering from a list of IDs.
   * @param {array} list List of IDs
   */
  static fromIdList(list) {
    const idToInd = list.reduce((accum, el, ind) => {
      accum[el] = ind;
      return accum;
    }, {});
    return new Ordering(idToInd, list);
  }

  findMax(arrOfIds) {
    let maxInd = -1;
    let maxId = -1;
    arrOfIds.forEach((id) => {
      const ind = this.idToInd[id];
      if (ind > maxInd) {
        maxInd = ind;
        maxId = id;
      }
    });
    return { id: maxId, ind: maxInd };
  }

  findMin(arrOfIds) {
    const minInd = this.idToInd[arrOfIds[0]];
    let minId = arrOfIds[0];
    arrOfIds.forEach((id) => {
      const ind = this.idToInd[id];
      if (ind < minId) {
        minId = ind;
        minId = id;
      }
    });
    return { id: minId, ind: minInd };
  }

  applyOrderAction(action) {
    switch (action.type) {
      case OrderActions.PLACE_AFTER:
        if (action.ids.length === 2) {
          this.placeAfter(action.ids[0], action.ids[1]);
        } else {
          const { id } = this.finMax(action.id);
          this.placeAfter(action.ids[0], id);
        }
        break;
      case OrderActions.PLACE_BEFORE:
        if (action.ids.length === 2) {
          this.placeBefore(action.ids[0], action.ids[1]);
        } else {
          const { id } = this.findMin(action.id);
          this.placeBefore(action.ids[0], id);
        }
        break;
      case OrderActions.PLACE_FRONT:
        this.placeAtFront(action.ids[0]);
        break;
      case OrderActions.PLACE_BACK:
        this.placeAtBack(action.ids[0]);
        break;
      default:
        break;
    }
  }

  /**
   * Replaces an old ID with a new ID
   * @param {integer} oldId The old ID
   * @param {integer} newId The new ID
   */
  replaceId(oldId, newId) {
    const ind = this.idToInd[oldId];
    delete this.idToInd[oldId];
    this.idToInd[newId] = ind;
    this.indToId[ind] = newId;
  }

  /**
   * Deletes an ID from the ordering.
   * @param {integer} id The ID to delete
   */
  delete(id) {
    const ind = this.idToInd[id];
    delete this.idToInd[id];
    for (let i = ind + 1; i < this.length; i++) {
      this.idToInd[this.indToId[i]] -= 1;
    }
    this.indToId.splice(ind, 1);
  }

  /**
   * Adds an ID at the back of the ordering.
   * @param {integer} id The ID
   */
  add(id) {
    this.indToId.push(id);
    this.idToInd[id] = this.indToId.length - 1;
  }

  /**
   * Places thegiven ID at the front of the ordering
   * @param {integer} id The ID
   */
  placeAtFront(id) {
    const ind = this.idToInd[id];
    if (ind === 0) return;

    this.idToInd[id] = 0;

    // Last element
    if (ind === this.indToId.length - 1) {
      // Increment indices
      for (let i = 0; i < this.indToId.length - 1; i++) {
        // Increment indices
        this.idToInd[this.indToId[i]] += 1;
      }
      // Fixup index list by removing the last element and adding it to the front
      this.indToId.pop();
      this.indToId.unshift(id);
      return;
    }

    for (let i = 0; i < ind; i++) {
      // Increment indices
      this.idToInd[this.indToId[i]] += 1;
    }
    // Fix the index list by deleting the element and adding it at the front
    this.indToId.splice(ind, 1);
    this.indToId.unshift(id);
  }

  /**
   * Places the given ID at the back of the ordering. Updates all
   * other ID location mappings
   * @param {integer} id The ID
   */
  placeAtBack(id) {
    const ind = this.idToInd[id];
    // Already good, let's stop here
    if (ind === this.length - 1) return;

    this.idToInd[id] = this.length - 1;

    // First element
    if (ind === 0) {
      // Decrement indices
      for (let i = 1; i < this.length; i++) {
        this.idToInd[this.indToId[i]] -= 1;
      }
      // Fixup index list by removing the first element and adding it to the back
      this.indToId.shift();
      this.indToId.push(id);
      return;
    }

    for (let i = ind + 1; i < this.length; i++) {
      // Decrement indices
      this.idToInd[this.indToId[i]] -= 1;
    }
    // Fix the index list by deleting the element and adding it at the back
    this.indToId.splice(ind, 1);
    this.indToId.push(id);
  }

  /**
   * Move the id towards the front by one step in the ordering
   * @param {integer} id The id
   */
  moveUp(id) {
    const ind = this.idToInd[id];
    if (ind === 0) return;
    const idAbove = this.indToId[ind - 1];
    this.swap(id, idAbove);
  }

  /**
   * Move the id towards the back by one step in the ordering
   * @param {integer} id The id
   */
  moveDown(id) {
    const ind = this.idToInd[id];
    if (ind === this.length - 1) return;
    const idBelow = this.indToId[ind + 1];
    this.swap(id, idBelow);
  }

  /**
   * Places id1 before id2 in the ordering
   * @param {integer} id1 First ID
   * @param {integer} id2 Second ID
   */
  placeBefore(id1, id2) {
    const i1 = this.idToInd[id1];
    const i2 = this.idToInd[id2];
    if (i1 < i2) return;

    for (let i = i2; i < i1; i++) {
      this.idToInd[this.indToId[i]] += 1;
    }
    this.indToId.splice(i1, 1);
    this.indToId.splice(i2, 0, id1);
    this.idToInd[id1] = i2;
  }

  /**
   * Places id1 after id2 in the ordering
   * @param {integer} id1
   * @param {integer} id2
   */
  placeAfter(id1, id2) {
    const i1 = this.idToInd[id1];
    const i2 = this.idToInd[id2];
    if (i1 > i2) return;

    for (let i = i1 + 1; i <= i2; i++) {
      this.idToInd[this.indToId[i]] -= 1;
    }
    // Delete from array
    this.indToId.splice(i1, 1);
    // Insert into appropriate location
    this.indToId.splice(i2, 0, id1);
    this.idToInd[id1] = i2;
  }

  /**
   * Swaps the two ID's in the ordering
   * @param {integer} id1
   * @param {integer} id2
   */
  swap(id1, id2) {
    const i1 = this.idToInd[id1];
    const i2 = this.idToInd[id2];
    // Swap out ID's
    this.indToId[i1] = id2;
    this.indToId[i2] = id1;

    // Swap indices
    this.idToInd[id1] = i2;
    this.idToInd[id2] = i1;
  }
}
