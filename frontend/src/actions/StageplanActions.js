import * as ApiActions from '@Actions/ApiActions.js';

export const StageplanActions = {
  ADD_STAGEPLAN_ELEMENTS: 'ADD_STAGEPLAN_ELEMENTS',
  GET_STAGEPLAN_ELEMENTS_AND_INSTRUMENTS: 'GET_STAGEPLAN_ELEMENTS_AND_INSTRUMENTS',
};
const Endpoints = {
  addStageplanElements: '/',
  getElementsAndInstruments: '/',
};

export function getStageplanElementsAndInstruments() {
  return ApiActions.readAuth(
    { action: StageplanActions.GET_STAGEPLAN_ELEMENTS_AND_INSTRUMENTS },
    Endpoints.getElementsAndInstruments,
  );
}

export function addStageplanElements(elements) {
  ApiActions.createAuth(
    {},
    Endpoints.addStageplanElements,
  );
}
