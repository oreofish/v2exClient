// @flow

import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import NavigationRouter from '../Navigation/NavigationRouter'
import { connect } from 'react-redux'
import ReduxPersist from '../Config/ReduxPersist'
import PlatformStyle from '../Lib/PlatformStyle'
import Colors from '../Themes/Colors'
import Fonts from '../Themes/Fonts'
import Metrics from '../Themes/Metrics'

class RootContainer extends Component {
  componentDidMount () {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }
  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
        <NavigationRouter />
      </View>
    )
  }
}

const styles = PlatformStyle.create({
  applicationView: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.background
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: Fonts.type.base,
    margin: Metrics.baseMargin
  },
  myImage: {
    width: 200,
    height: 200,
    alignSelf: 'center'
  }
})

// wraps dispatch to create nicer functions to call within our component
/*
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup())
})
*/

export default connect(null, null)(RootContainer)
