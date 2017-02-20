import { take, fork, put, call } from 'redux-saga/effects'
import LoginActions, {NOT_LOGIN} from '../Redux/LoginRedux'
import WebApi from '../Services/WebApi'
import ImageUtils from '../Lib/ImageUtils'
import {Actions} from 'react-native-router-flux'

function* performLogin (ip, username, password) {
  try {
    const data = {
      method: 'login',
      user_login: username,
      password: password
    }

    let response = yield WebApi.signin(ip, data)
    if (response.status === 200) {
      const json = response.data
      if (json) {
        Actions.pop() // can pop screen at any point in app
        // console.log('----------------', 'performLogin', 'Actions.pop()')
        yield put(LoginActions.loginSuccess(ip, username, json.sessionKey))
      } else {
        yield put(LoginActions.loginFailure('未知错误，请重试或联系开发者'))
      }
    } else {
      // yield put(LoginActions.loginFailure(problemMessage.replace('请解决以下问题然后再提交：', '')))
      yield put(LoginActions.loginFailure('未知错误，请重试或联系开发者'))
    }
  } catch (error) {
    yield put(LoginActions.loginFailure('网络错误，请重试'))
  }
}

function * fetchUserInfo (username) {
  try {
    const $ = yield WebApi.getPage(`/member/${username}`)
    const avatarURI = $('img.avatar').attr('src')
    const avatar = ImageUtils.handleAvatarImageURI(avatarURI)
    yield put(LoginActions.setUser(avatar))
  } catch (error) {
    console.log('error:', error)
  }
}

// attempts to login
export function * loginFlow (loginState) {
  console.log('========================', 'loginFlow', loginState)
  while (true) {
    if (loginState.status === NOT_LOGIN) {
      // waiting for login request
      const {ip, username, password} = yield take('LOGIN_REQUEST')
      yield fork(performLogin, ip, username, password) // real login
    } else {
      // already logged, fetch user info
      yield call(fetchUserInfo, loginState.username)
    }

    // const action = yield take(['LOGOUT', 'LOGIN_FAILURE']) // waiting for logout or failure
    // yield put(LoginActions.logout())
  }
}

