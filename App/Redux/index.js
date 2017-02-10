// @flow

import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'

export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = combineReducers({
    temperature: require('./TemperatureRedux').reducer,
    login: require('./LoginRedux').reducer,
    search: require('./SearchRedux').reducer
  })

  const store = configureStore(rootReducer, rootSaga)

/*  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept(() => {
      store.replaceReducer(rootReducer)
    })
  } */

  return store
}
