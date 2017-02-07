import { take, fork, put } from 'redux-saga/effects'
import LoginActions from '../Redux/LoginRedux'
import SessionManager from '../Lib/SessionManager'
import V2exApi from '../Services/V2exApi'

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
    const {username, password} = yield take('LOGIN_REQUEST') // waiting for login request
    const postToken = yield getPostToken() // get form token first
    yield fork(performLogin, username, password, postToken) // real login
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

