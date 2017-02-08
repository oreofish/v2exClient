import { take, fork, put } from 'redux-saga/effects'
import LoginActions from '../Redux/LoginRedux'
import SessionManager from '../Lib/SessionManager'
import V2exApi from '../Services/V2exApi'
import ImageUtils from '../Lib/ImageUtils'

function getPostToken () {
  const postToken = V2exApi.getSigninForm()
  console.log('getPostToken', '--------------------', postToken)
  return postToken
}

function* performLogin (username, password, postToken) {
  try {
    const { usernameFieldName, passwordFieldName, once } = postToken
    const data = { once, next: '/' }
    data[usernameFieldName] = username
    data[passwordFieldName] = password
    console.log('performLogin data:', data)

    let $ = yield V2exApi.postSignin(data)
    const problemMessage = $('.problem').text()
    if (problemMessage && problemMessage.length > 0) {
      yield put(LoginActions.loginFailure(problemMessage.replace('请解决以下问题然后再提交：', '')))
    } else {
      SessionManager.setCurrentUser($)
      const user = SessionManager.getCurrentUser()
      if (user) {
        yield put(LoginActions.loginSuccess(username))
      } else {
        yield put(LoginActions.loginFailure('未知错误，请重试或联系开发者'))
      }
    }
  } catch (error) {
    yield put(LoginActions.loginFailure('网络错误，请重试'))
  }
}

// attempts to login
export function * loginFlow () {
  while (true) {
    // read local cached user
    const user = SessionManager.getCurrentUser()
    console.log('loginFlow', '====================================', user)

    if (user) {
      // fetch user info
      console.log('SessionManager.getCurrentUser():', user)
      const { name } = user
      try {
        const $ = yield V2exApi.getPage(`/member/${name}`)
        const avatarURI = $('img.avatar').attr('src')
        user.avatarURI = ImageUtils.handleAvatarImageURI(avatarURI)
        console.log('user:', user)
        yield put(LoginActions.loadUser(user))
      } catch (error) {
        console.log('error:', error)
      }
    } else {
      // load nothing, waiting for login request
      const {username, password} = yield take('LOGIN_REQUEST')
      const postToken = yield getPostToken() // get form token first
      yield fork(performLogin, username, password, postToken) // real login
    }

    const action = yield take(['LOGOUT', 'LOGIN_FAILURE']) // waiting for logout or failure
    if (action.type === 'LOGOUT') {
      SessionManager.logOut().then(res => {
        console.log('log out succeed:', res)
      }, err => {
        console.log('log out err:', err)
      })
    } else {
      console.log('loginFlow:', 'LOGIN_FAILURE')
    }
    // yield put(LoginActions.logout())
  }
}

