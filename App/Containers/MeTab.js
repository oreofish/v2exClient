import React, {Component} from 'react'
import { connect } from 'react-redux'
import {View, Text, ScrollView, TouchableWithoutFeedback} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'

import PlatformStyle from '../Lib/PlatformStyle'
import LoginActions, {HAS_LOGGED} from '../Redux/LoginRedux'

import PageContainer from '../Components/common/PageContainer'
import ActionRow from './../Components/ActionRow'
import AvatarImage from '../Components/common/AvatarImage'

import {Images} from '../Themes'

type MeTabProps = {
  username: string,
  password: string,
  avatar: string,
  status: number,
  errorMessage: string,
  logOut: () => void
}

class MeTab extends Component {

  props: MeTabProps

  componentDidMount () {
  }

  render () {
    return (
      <PageContainer isTab>
        <ScrollView style={styles.wrapper}>
          {this.props.status === HAS_LOGGED ? this.renderLoggedIn() : this.renderNotLoggedIn()}
        </ScrollView>
      </PageContainer>
    )
  }

  renderNotLoggedIn = () => {
    return (
      <View>
        <TouchableWithoutFeedback onPress={this.onLoginPress}>
          <View style={styles.topBox}>
            <View style={styles.emptyAvatar} />
            <Text style={styles.usernameText}>尚未登录，请登录</Text>
            <View style={styles.rightArrowContainer}>
              <Icon style={styles.rightArrow} name='chevron-right' size={13} color='#CCCCDE' />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.bottomBox}>
          <ActionRow showSeparator={false} title='设置' onPress={this.onSettingPress} iconImage={Images.setting_icon} />
        </View>
      </View>
    )
  }

  renderLoggedIn = () => {
    const { username, avatar } = this.props
    return (
      <View>
        <View style={styles.topBox}>
          <View style={styles.emptyAvatar}>
            <AvatarImage uri={avatar} style={styles.avatarImage} />
          </View>
          <Text style={styles.usernameText}>{username}</Text>
        </View>
        <View style={styles.bottomBox}>
          <ActionRow showSeparator={false} title='注销' onPress={this.onLogOutPress} iconImage={Images.signout_icon} />
        </View>
      </View>
    )
  }

  onLoginPress = () => {
    Actions.login()
  }

  onSettingPress = () => {
    console.log('press')
  }

  onLogOutPress = () => {
    this.props.logOut()
  }
}

const styles = PlatformStyle.create({
  wrapper: {
    backgroundColor: '#F1F1F5',
    flex: 1
  },

  topBox: {
    height: 75,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    flexDirection: 'row'
  },
  emptyAvatar: {
    width: 55,
    height: 55,
    backgroundColor: '#F1F1F5',
    borderRadius: 55,
    marginLeft: 12,
    overflow: 'hidden'
  },
  avatarImage: {
    width: 55,
    height: 55
  },
  usernameText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333333'
  },
  rightArrowContainer: {
    flex: 1
  },
  rightArrow: {
    width: 8,
    height: 13,
    alignSelf: 'flex-end',
    marginRight: 16,
    marginTop: 2
  },

  bottomBox: {
    marginTop: 20,
    backgroundColor: '#FFFFFF'
  }
})

const mapStateToProps = (state) => {
  return state.login
}

const mapDispatchToProps = (dispatch) => {
  return {
    logOut: () => {
      dispatch(LoginActions.logout())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MeTab)
