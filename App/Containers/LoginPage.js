// @flow

import React, {Component} from 'react'
import { connect } from 'react-redux'
import {View, Text, TouchableOpacity, StatusBar, TextInput, Image} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Button from 'react-native-button'
import Icon from 'react-native-vector-icons/FontAwesome'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import {Images} from '../Themes'

import PlatformStyle from '../Lib/PlatformStyle'
import LoginActions from '../Redux/LoginRedux'
// import I18n from 'react-native-i18n'

type LoginPageProps = {
  username: string,
  password: string,
  isLoading: boolean,
  errorMessage: string,
  attemptLogin: () => void
}

class LoginPage extends Component {

  props: LoginPageProps

/*  constructor (props) {
    super(props)
  } */

  componentWillReceiveProps (newProps) {
    // this.forceUpdate()
    // Did the login attempt complete?
    if (this.isLoading) {
      Actions.pop()
    }
  }

  componentWillMount () {

  }

  componentWillUnmount () {

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
            <Icon name='times' size={27} color='#CCCCDE' style={styles.closeButton} />
          </TouchableOpacity>
          <Text style={styles.titleText}>登录</Text>
        </View>
        <Image source={Images.logo} style={styles.topLogo} />

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

        {/* The view that will animate to match the keyboards height */}
        <KeyboardSpacer />
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

      this.props.attemptLogin(username, password)
    }
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
    width: 50,
    height: 50
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
    flex: 1,
    maxHeight: 120,
    minHeight: 20
  }
})

const mapStateToProps = (state) => {
  console.log('LoginPage', 'mapStateToProps', state.login.isLoading, state.login.errorMessage)
  if (!state.login.isLoading && state.login.errorMessage.empty) {
    // close login page when login success
    // is here the right place to close page?
    Actions.pop()
  }
  return state.login
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptLogin: (username, password) => dispatch(LoginActions.loginRequest(username, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)

