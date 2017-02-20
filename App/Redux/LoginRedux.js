// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setUser: ['avatar'],
  loginRequest: ['ip', 'username', 'password'],
  loginSuccess: ['ip', 'username', 'sessionKey'],
  loginFailure: ['errorMessage'],
  logout: null
})

export const LoginTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const NOT_LOGIN = 'NOT_LOGIN'
export const LOGGING_IN = 'LOGGING_IN'
export const HAS_LOGGED = 'HAS_LOGGED'
export const LOGIN_FAILED = 'LOGIN_FAILED'

export const INITIAL_STATE = Immutable({
  ip: null,
  username: null,
  password: null,
  sessionKey: null,
  avatar: null,
  status: NOT_LOGIN,
  errorMessage: null
})

/* ------------- Reducers ------------- */

// load local cached user info
export const setUser = (state: Object, { avatar }: Object) => state.merge({ avatar: avatar })

// we're attempting to login
export const request = (state: Object) => state.merge({ status: LOGGING_IN, errorMessage: null })

// we've successfully logged in
export const success = (state: Object, { ip, username, sessionKey }: Object) => {
  return state.merge({status: HAS_LOGGED, errorMessage: null, ip, username, sessionKey})
}

// we've had a problem logging in
export const failure = (state: Object, { errorMessage }: Object) => {
  return state.merge({status: LOGIN_FAILED, errorMessage})
}

// we've logged out
export const logout = (state: Object) => INITIAL_STATE

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_USER]: setUser,
  [Types.LOGIN_REQUEST]: request,
  [Types.LOGIN_SUCCESS]: success,
  [Types.LOGIN_FAILURE]: failure,
  [Types.LOGOUT]: logout
})

/* ------------- Selectors ------------- */

// Is the current user logged in?
export const isLoggedIn = (loginState: Object) => loginState.username !== null
