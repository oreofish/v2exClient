// @flow

import React, {Component} from 'react'
import { connect } from 'react-redux'
import {View, Text, TouchableOpacity, StatusBar, TextInput, Image, Keyboard, LayoutAnimation} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Button from 'react-native-button'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Images, Metrics} from '../Themes'

import SessionManager from '../Lib/SessionManager'
import PlatformStyle from '../Lib/PlatformStyle'
import V2exApi from '../Services/V2exApi'

import LoginActions from '../Redux/LoginRedux'
// import I18n from 'react-native-i18n'

const CLOSE_BUTTON_SIZE = 27

type LoginPageProps = {
  dispatch: () => any,
  fetching: boolean,
  attemptLogin: () => void
}

class LoginPage extends Component {

  props: LoginPageProps

  state: {
    username: string,
    password: string,
    visibleHeight: number,
    // isInfoWrong: boolean,
    isLoading: boolean,
    errorMessage: string,
    topLogo: {
      width: number
    }
  }

  keyboardDidShowListener: Object
  keyboardDidHideListener: Object

  constructor (props) {
    super(props)

    this.state = {
      username: null,
      password: null,
      visibleHeight: Metrics.screenHeight,
      // isInfoWrong: false,
      isLoading: false,
      errorMessage: null,
      topLogo: { width: Metrics.screenWidth }
    }
  }

  componentWillReceiveProps (newProps) {
    this.forceUpdate()
    // Did the login attempt complete?
    if (this.isLoading && !newProps.fetching) {
      Actions.pop()
    }
  }

  componentWillMount () {
    // Using keyboardWillShow/Hide looks 1,000 times better, but doesn't work on Android
    // TODO: Revisit this if Android begins to support - https://github.com/facebook/react-native/issues/3468
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  keyboardDidShow = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    let newSize = Metrics.screenHeight - e.endCoordinates.height
    this.setState({
      visibleHeight: newSize,
      topLogo: {width: 100, height: 50}
    })
  }

  keyboardDidHide = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({
      visibleHeight: Metrics.screenHeight,
      topLogo: {width: Metrics.screenWidth}
    })
  }

  componentDidMount () {
    this.getPostToken()
  }

  render () {
    const { isLoading, errorMessage } = this.state

    return (
      <View style={styles.container}>
        <StatusBar barStyle='default' />
        <View style={styles.firstRow}>
          <TouchableOpacity onPress={Actions.pop} style={styles.closeButtonWrapper}>
            <Icon name='times' size={CLOSE_BUTTON_SIZE} color='#CCCCDE' style={styles.closeButton} />
          </TouchableOpacity>
          <Text style={styles.titleText}>Wetoo</Text>
        </View>
        <Image source={Images.logo} style={[styles.topLogo, this.state.topLogo]} />

        <View style={styles.loginFormWrapper}>
          <View style={styles.formInputWrapper}>
            <TextInput placeholder='Email 或 用户名'
              style={styles.formInput}
              keyboardType='email-address'
              ref='usernameField'
              autoCapitalize='none'
              autoCorrect={false}
              returnKeyType='next'
              onChangeText={(username) => this.setState({ username })}
              onSubmitEditing={() => this.refs['passwordField'].focus()}
              underlineColorAndroid='#FFFFFF' />
          </View>
          <View style={[styles.formInputWrapper, styles.formInputWrapperForPassword]}>
            <TextInput placeholder='密码'
              style={styles.formInput}
              keyboardType='default'
              returnKeyType='go'
              ref='passwordField'
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry
              onChangeText={(password) => this.setState({ password })}
              onSubmitEditing={this.onSubmitButtonPress}
              underlineColorAndroid='#FFFFFF' />
          </View>
        </View>

        <View style={styles.loginFeedbackWrapper}>
          <Text style={styles.loginFeedbackText}>{errorMessage}</Text>
        </View>

        <Button onPress={this.onSubmitButtonPress}
          disabled={isLoading}
          style={styles.loginButtonText}
          containerStyle={[styles.loginButtonContainer, isLoading ? styles.loginButtonContainerDisabled : {}]}>
          {isLoading ? '登录中...' : '登录'}
        </Button>
      </View>
    )
  }

  onSubmitButtonPress = () => {
    const { isLoading, username, password } = this.state
    if (!username || !password || username.length === 0 || password.length === 0) {
      return
    }
    if (!isLoading) {
      this.refs['usernameField'].blur()
      this.refs['passwordField'].blur()

      this.setState({ isLoading: true, errorMessage: null })

      if (!this.postToken) {
        this.getPostToken().then(() => this.performLogin())
      } else {
        this.performLogin()
      }
    }
  }

  async getPostToken () {
    try {
      let $ = await V2exApi.getSigninForm()
      const usernameFieldName = $('input[placeholder="用户名或电子邮箱地址"]').attr('name')
      const passwordFieldName = $('input[type="password"]').attr('name')
      const once = $('input[name="once"]').attr('value')
      const postToken = { usernameFieldName, passwordFieldName, once }
      this.postToken = postToken
      console.log('getPostToken', '--------------------', this.postToken)
      return postToken
    } catch (error) {
      console.log('error when getting post token:', error)
    }
  }

  async performLogin () {
    try {
      const { username, password } = this.state
      const { usernameFieldName, passwordFieldName, once } = this.postToken
      const data = { once, next: '/' }
      data[usernameFieldName] = username
      data[passwordFieldName] = password
      console.log('performLogin data:', data)

      let $ = await V2exApi.postSignin(data)
      const problemMessage = $('.problem').text()
      if (problemMessage && problemMessage.length > 0) {
        this.cancelLogin(problemMessage.replace('请解决以下问题然后再提交：', ''))
      } else {
        SessionManager.setCurrentUser($)
        const user = SessionManager.getCurrentUser()
        if (user) {
          this.loginSucceed()
        } else {
          this.cancelLogin('未知错误，请重试或联系开发者')
        }
      }
    } catch (error) {
      this.cancelLogin('网络错误，请重试')
    }
  }

  cancelLogin = (errorMessage = null) => {
    console.log('cancelLogin', errorMessage)
    this.postToken = null
    this.setState({ isLoading: false, errorMessage })
  }

  loginSucceed = () => {
    console.log('loginSucceed', '--------------------')
    Actions.pop()
  }

}

const styles = PlatformStyle.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    paddingTop: 30,
    paddingLeft: 16,
    paddingRight: 16
  },
  firstRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#329EED',
    marginRight: 25,
    flex: 1,
    textAlign: 'center'
  },
  closeButtonWrapper: {},
  closeButton: {
    width: CLOSE_BUTTON_SIZE,
    height: CLOSE_BUTTON_SIZE
  },

  loginFormWrapper: {
    marginTop: 10,
    marginBottom: 10
  },
  formInputWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#D8E0E4'
  },
  formInputWrapperForPassword: {
    marginTop: 18
  },
  formInput: {
    height: 30,
    android: {
      height: 36
    }
  },

  loginFeedbackWrapper: {
    height: 20,
    marginBottom: 15
  },
  loginFeedbackText: {
    color: 'red',
    textAlign: 'center'
  },

  loginButtonContainer: {
    height: 40,
    borderRadius: 5,
    backgroundColor: '#73BCF1',
    justifyContent: 'center'
  },
  loginButtonContainerDisabled: {
    backgroundColor: '#B9DDF8'
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '300'
  },
  topLogo: {
    alignSelf: 'center',
    resizeMode: 'contain',
    height: 50
  }
})

const mapStateToProps = (state) => {
  return {
    fetching: state.login.fetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptLogin: (username, password) => dispatch(LoginActions.loginRequest(username, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)

