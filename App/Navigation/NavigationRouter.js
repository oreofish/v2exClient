// @flow

import React, { Component } from 'react'
import { Scene, Router } from 'react-native-router-flux'
// import Styles from './Styles/NavigationContainerStyle'
// import NavigationDrawer from './NavigationDrawer'
// import NavItems from './NavItems'
import CustomNavBar from '../Navigation/CustomNavBar'

import TabIcon from '../Components/TabIcon'
import PlatformStyle from '../Lib/PlatformStyle'

// screens identified by the router
import DiscoveryTab from '../Containers/DiscoveryTab'
import NodesTab from '../Containers/NodesTab'
import UsageExamplesScreen from '../Containers/UsageExamplesScreen'
import LoginScreen from '../Containers/LoginPage'

import TopicPageContainer from '../Containers/TopicPage'
import UserPageContainer from '../Containers/UserPage'
import UserTopicPageContainer from '../Containers/UserTopicPage'
import UserReply from '../Containers/UserReply'
import NodePage from '../Containers/Node'
import NewTopicPage from '../Containers/NewTopic'

import ListviewExample from '../Containers/ListviewExample'
import ListviewGridExample from '../Containers/ListviewGridExample'
import ListviewSectionsExample from '../Containers/ListviewSectionsExample'
import ListviewSearchingExample from '../Containers/ListviewSearchingExample'
import MeTab from '../Containers/MeTab'
import ThemeScreen from '../Containers/ThemeScreen'
import DeviceInfoScreen from '../Containers/DeviceInfoScreen'

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

class NavigationRouter extends Component {
  render () {
    return (
      <Router>
        <Scene key='root' titleStyle={styles.titleStyle} navigationBarStyle={styles.navigationBarStyle}>
          <Scene key='tabbar' tabs tabBarStyle={styles.tabBar} hideNavBar navigationBarStyle={styles.navigationBarStyle}>
            <Scene key='DiscoveryTab'
              component={DiscoveryTab}
              titleStyle={styles.titleStyle}
              navigationBarStyle={styles.navigationBarStyle}
              icon={TabIcon}
              initial
              title='Ignite' />
            <Scene key='NodesTab'
              component={NodesTab}
              title='组件'
              titleStyle={styles.titleStyle}
              navigationBarStyle={styles.navigationBarStyle}
              icon={TabIcon} />
            <Scene key='usageExamples'
              component={UsageExamplesScreen}
              title='Usage'
              titleStyle={styles.titleStyle}
              navigationBarStyle={styles.navigationBarStyle}
              icon={TabIcon} />
            <Scene key='MeTab'
              component={MeTab}
              title='我'
              titleStyle={styles.titleStyle}
              navigationBarStyle={styles.navigationBarStyle}
              icon={TabIcon} />
          </Scene>

          <Scene key='topic' component={TopicPageContainer} title='阅读话题' />
          <Scene key='user' component={UserPageContainer} title='用户' />
          <Scene key='user_topic' component={UserTopicPageContainer} title='用户话题' />
          <Scene key='userReply' component={UserReply} title='用户回复' />
          <Scene key='node' component={NodePage} title='节点' />
          <Scene key='newTopic' component={NewTopicPage} title='创建话题' />

          <Scene key='login' component={LoginScreen} direction='vertical' title='Login' hideNavBar />
          <Scene key='listviewExample' component={ListviewExample} title='Listview Example' rightTitle='Example' onRight={() => window.alert('Example Pressed')} />
          <Scene key='listviewGridExample' component={ListviewGridExample} title='Listview Grid' />
          <Scene key='listviewSectionsExample' component={ListviewSectionsExample} title='Listview Sections' />
          <Scene key='listviewSearchingExample' component={ListviewSearchingExample} title='Listview Searching' navBar={CustomNavBar} />
          <Scene key='theme' component={ThemeScreen} title='Theme' />

          {/* Custom navigation bar example */}
          <Scene key='deviceInfo' component={DeviceInfoScreen} title='Device Info' />
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
