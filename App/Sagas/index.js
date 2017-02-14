import { fork, takeLatest } from 'redux-saga/effects'
// import FixtureAPI from '../Services/FixtureApi'
// import DebugSettings from '../Config/DebugSettings'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { TopicTypes } from '../Redux/TopicRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { loginFlow } from './LoginSagas'
import { getTopic } from './TopicSagas'

/* ------------- Connect Types To Sagas ------------- */

export default function * root (state) {
  yield [
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),
    fork(loginFlow, state.login),
    // some sagas receive extra parameters in addition to an action
    takeLatest(TopicTypes.TOPIC_REQUEST, getTopic)
  ]
}
