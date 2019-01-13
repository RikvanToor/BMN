import * as ApiActions from '@Actions/ApiActions.js';
import { withKeys } from '@Utils/ObjectUtils.js';
import { format } from '@Utils/StringUtils.js';
import Stageplan from '../models/Stageplan/Stageplan';

export const StageplanActions = {
  ADD_STAGEPLAN_ELEMENT_REMOTE: 'ADD_STAGEPLAN_ELEMENT_REMOTE',
  ADD_STAGEPLAN_ELEMENT: 'ADD_STAGEPLAN_ELEMENT',
  ADD_STAGEPLAN_ELEMENTS: 'ADD_STAGEPLAN_ELEMENTS',
  DELETE_ELEMENT: 'DELETE_ELEMENT',
  GET_LATEST_STAGEPLAN: 'GET_LATEST_STAGEPLAN',
  GET_STAGEPLAN_ELEMENTS_AND_INSTRUMENTS: 'GET_STAGEPLAN_ELEMENTS_AND_INSTRUMENTS',
  GET_STAGEPLAN: 'GET_STAGEPLAN',
  UPDATE_GEOMETRIES: 'UPDATE_GEOMETRIES',
  UPDATE_NAME: 'UPDATE_NAME',
  UPDATE_ORDER: 'UPDATE_ORDER',
};
const Endpoints = {
  addStageplanElement: 'stageplan/{0}/element',
  addStageplanElements: 'stageplan/{0}/elements',
  getElementsAndInstruments: '/',
  getLatestStageplan: 'stageplan',
  getStageplan: 'stageplan/{0}',
  stageplanElement: 'stageplan/{0}/element/{1}',
  updateGeometry: 'stageplan/{0}/geometries',
  updateOrder: 'stageplan/{0}/order',
};

export function getStageplanElementsAndInstruments() {
  return ApiActions.readAuth(
    { action: StageplanActions.GET_STAGEPLAN_ELEMENTS_AND_INSTRUMENTS },
    Endpoints.getElementsAndInstruments,
  );
}

/**
 * Updates geometry of the elements in the given map.
 * @param {Map} dirtyMap Immutable Map with Geometry classes as values and id's of elements as keys.
 */
export function updateGeometry(dirtyMap, stageplanId) {
  const updateElements = dirtyMap.map((val, key) => ({ id: key, geometry: val.stringify() })).toJS();
  return ApiActions.updateAuth(
    { action: StageplanActions.UPDATE_GEOMETRIES, elements: updateElements },
    format(Endpoints.updateGeometry, stageplanId),
  );
}

export function updateName(id, name, stageplanId) {
  return ApiActions.updateAuth({
    action: StageplanActions.UPDATE_NAME,
    name,
  },
  format(Endpoints.stageplanElement, stageplanId, id));
}

export function deleteElement(id, stageplanId) {
  return ApiActions.deleteAuth({
    action: StageplanActions.DELETE_ELEMENT,
    id,
  },
  format(Endpoints.stageplanElement, stageplanId, id));
}

export function addStageplanElement(element, stageplanId) {
  return { action: StageplanActions.ADD_STAGEPLAN_ELEMENT, element, id: stageplanId };
}

export function addStageplanElementRemote(element, stageplanId) {
  const el = withKeys(element, ['name', 'type']);
  el.geometry = element.geometry.stringify();

  return ApiActions.createAuth(
    { action: StageplanActions.ADD_STAGEPLAN_ELEMENT_REMOTE, element: el },
    format(Endpoints.addStageplanElement, stageplanId),
  );
}

/**
 * Updates the ordering of stageplan elements (back-to-front)
 * @param {Ordering} ordering
 * @param {integer} stageplanId Target stageplan
 * @returns Action object
 */
export function updateOrdering(ordering, stageplanId) {
  return ApiActions.updateAuth({
    action: StageplanActions.UPDATE_ORDER,
    order: ordering.indToId,
  }, format(Endpoints.updateOrder, stageplanId));
}

export function addStageplanElements(elements) {
  return ApiActions.createAuth(
    {
      action: StageplanActions.ADD_STAGEPLAN_ELEMENTS,

    },
    Endpoints.addStageplanElements,
  );
}

/**
 * Acquires the latest stageplan
 */
export function getLatestStageplan() {
  return ApiActions.readAuth(
    { action: StageplanActions.GET_LATEST_STAGEPLAN },
    Endpoints.getLatestStageplan,
  );
}
