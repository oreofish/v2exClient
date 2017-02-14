import { select } from 'redux-saga/effects'
// import TopicsActions from '../Redux/TopicsRedux'
import { is } from 'ramda'

// exported to make available for tests
export const selectTemperature = (state) => state.temperature

// process STARTUP actions
export function * startup () {
  const temp = yield select(selectTemperature)
  // only fetch new temps when we don't have one yet
  if (!is(Number, temp)) {
    // yield put(TopicsActions.temperatureRequest('San Francisco'))
  }
}
