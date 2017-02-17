import { fork, takeLatest } from 'redux-saga/effects'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { loginFlow } from './LoginSagas'

/* ------------- Connect Types To Sagas ------------- */

export default function * root (state) {
  yield [
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),
    fork(loginFlow, state.login)
  ]
}
