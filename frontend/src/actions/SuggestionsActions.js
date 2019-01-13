/* eslint-disable import/prefer-default-export */
import * as ApiActions from './ApiActions';

export const SuggestionsActions = {
  GET_SUGGESTIONS: 'GET_SUGGESTIONS',
};

const Endpoints = {
  getSuggestions: 'songs/suggestions',
};

export function getSuggestions() {
  return ApiActions.readAuth(
    { action: SuggestionsActions.GET_SUGGESTIONS },
    Endpoints.getSuggestions,
  );
}
