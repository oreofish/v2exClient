import { take, fork, put, call } from 'redux-saga/effects'
import LoginActions, {NOT_LOGIN} from '../Redux/LoginRedux'
import V2exApi from '../Services/WebApi'
import ImageUtils from '../Lib/ImageUtils'
import {Actions} from 'react-native-router-flux'

function getCurrentUserFromHTML ($ = null) {
  if (!$) {
    return null
  }
  const usernameElement = $('#Top table td:nth-child(3) a:nth-child(2)')
  const name = usernameElement.text()
  const uri = usernameElement.attr('href')
  if (uri === '/signup' || uri.indexOf('/member/') === -1) {
    return null
  } else {
    return name
  }
}

function getPostToken () {
  const postToken = V2exApi.getSigninForm()
  return postToken
}

function* performLogin (username, password, postToken) {
  try {
    const { usernameFieldName, passwordFieldName, once } = postToken
    const data = { once, next: '/' }
    data[usernameFieldName] = username
    data[passwordFieldName] = password
    // console.log('performLogin data:', data)

    let $ = yield V2exApi.postSignin(data)
    const problemMessage = $('.problem').text()
    if (problemMessage && problemMessage.length > 0) {
      yield put(LoginActions.loginFailure(problemMessage.replace('请解决以下问题然后再提交：', '')))
    } else {
      const username = getCurrentUserFromHTML($)
      if (username) {
        yield call(fetchUserInfo, username)
        Actions.pop() // can pop screen at any point in app
        // console.log('----------------', 'performLogin', 'Actions.pop()')
        yield put(LoginActions.loginSuccess(username))
      } else {
        yield put(LoginActions.loginFailure('未知错误，请重试或联系开发者'))
      }
    }
  } catch (error) {
    yield put(LoginActions.loginFailure('网络错误，请重试'))
  }
}

function * fetchUserInfo (username) {
  try {
    const $ = yield V2exApi.getPage(`/member/${username}`)
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
      const {username, password} = yield take('LOGIN_REQUEST')
      const postToken = yield getPostToken() // get form token first
      yield fork(performLogin, username, password, postToken) // real login
    } else {
      // already logged, fetch user info
      yield call(fetchUserInfo, loginState.username)
    }

    // const action = yield take(['LOGOUT', 'LOGIN_FAILURE']) // waiting for logout or failure
    // yield put(LoginActions.logout())
  }
}

