// @flow

import React, { Component } from 'react'
import { Scene, Router } from 'react-native-router-flux'
// import Styles from './Styles/NavigationContainerStyle'
// import NavigationDrawer from './NavigationDrawer'
// import NavItems from './NavItems'

import PlatformStyle from '../Lib/PlatformStyle'
// screens identified by the router
import LoginScreen from '../Containers/LoginPage'
import MeTab from '../Containers/MeTab'

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

class NavigationRouter extends Component {
  render () {
    return (
      <Router>
        <Scene key='root' titleStyle={styles.titleStyle} navigationBarStyle={styles.navigationBarStyle}>
          <Scene initial key='MeTab'
            component={MeTab}
            title='我'
            titleStyle={styles.titleStyle}
            navigationBarStyle={styles.navigationBarStyle} />

          <Scene key='login' component={LoginScreen} direction='vertical' title='Login' hideNavBar />
        </Scene>
      </Router>
    )
  }
}

const styles = PlatformStyle.create({
  navigationBarStyle: {
    backgroundColor: '#329EED',
    borderBottomWidth: 0,
    borderBottomColor: 'lightgray'
  },
  titleStyle: {
    color: '#FFFFFF'
  },
  tabBar: {
    backgroundColor: '#FFFFF0',
    android: {
      borderTopWidth: 0.5,
      borderTopColor: '#B2B2ff'
    },
    ios: {
      shadowColor: '#B2B2ff',
      shadowOffset: {
        width: 0,
        height: -0.5
      },
      shadowOpacity: 1,
      shadowRadius: 0
    }
  }
})

export default NavigationRouter
