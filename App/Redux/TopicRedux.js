// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  topicRequest: ['slug'],
  topicSuccess: ['slug'],
  topicFailure: ['errorMessage'],
  topicClear: null
})

export const TopicTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable([])

/* ------------- Reducers ------------- */

// we're attempting to fetch topics
// export const request = (state: Object) => state.merge({ status: TOPICS_REQUEST })

// we've successfully fetch topics
export const success = (state: Object, { username }: Object) => {
  return state.merge({})
}

// we've had a problem fetching
export const failure = (state: Object, { errorMessage }: Object) => {
  return state.merge({})
}

export const clear = (state: Object) => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
//  [Types.TOPIC_REQUEST]: request,
  [Types.TOPIC_SUCCESS]: success,
  [Types.TOPIC_FAILURE]: failure,
  [Types.TOPIC_CLEAR]: clear
})

/* ------------- Selectors ------------- */

