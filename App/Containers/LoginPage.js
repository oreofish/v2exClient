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
import LoginActions, {LOGGING_IN} from '../Redux/LoginRedux'
// import I18n from 'react-native-i18n'

type LoginPageProps = {
  ip: string,
  username: string,
  password: string,
  avatar: string,
  status: number,
  errorMessage: string,
  attemptLogin: () => void
}

class LoginPage extends Component {

  props: LoginPageProps

  componentWillReceiveProps (newProps) {
  }

  componentWillMount () {
  }

  componentWillUnmount () {

  }

  componentDidMount () {
  }

  render () {
    const { status, errorMessage } = this.props

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
            <TextInput placeholder='iLo主机IP'
              style={styles.formInput}
              keyboardType='numbers-and-punctuation'
              ref='ipField'
              autoCapitalize='none'
              autoCorrect={false}
              returnKeyType='next'
              value={this.props.ip}
              onChangeText={(ip) => this.props({ip})}
              onSubmitEditing={() => this.refs['usernameField'].focus()}
              underlineColorAndroid='#FFFFFF' />
          </View>
          <View style={styles.formInputWrapper}>
            <TextInput placeholder='Email 或 用户名'
              style={styles.formInput}
              keyboardType='email-address'
              ref='usernameField'
              autoCapitalize='none'
              autoCorrect={false}
              returnKeyType='next'
              value={this.props.username}
              onChangeText={(username) => this.props({username})}
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
              value={this.props.password}
              onChangeText={(password) => this.props({password})}
              onSubmitEditing={this.onSubmitButtonPress}
              underlineColorAndroid='#FFFFFF' />
          </View>
        </View>

        <View style={styles.loginFeedbackWrapper}>
          <Text style={styles.loginFeedbackText}>{errorMessage}</Text>
        </View>

        <Button onPress={this.onSubmitButtonPress}
          disabled={status === LOGGING_IN}
          style={styles.loginButtonText}
          containerStyle={[styles.loginButtonContainer, status === LOGGING_IN ? styles.loginButtonContainerDisabled : {}]}>
          {status === LOGGING_IN ? '登录中...' : '登录'}
        </Button>

        {/* The view that will animate to match the keyboards height */}
        <KeyboardSpacer />
      </View>
    )
  }

  onSubmitButtonPress = () => {
    const { ip, status, username, password } = this.props
    console.log(this.props)
    if (!username || !password || username.length === 0 || password.length === 0) {
      return
    }
    if (status !== LOGGING_IN) {
      this.refs['ipField'].blur()
      this.refs['usernameField'].blur()
      this.refs['passwordField'].blur()

      this.props.attemptLogin(ip, username, password)
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
  return state.login
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptLogin: (ip, username, password) => dispatch(LoginActions.loginRequest(ip, username, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)

