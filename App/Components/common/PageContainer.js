import React, {Component, PropTypes} from 'react'
import {View} from 'react-native'

import PlatformStyle from '../../Lib/PlatformStyle'

class PageContainer extends Component {

  static propTypes = {
    isTab: PropTypes.bool
  };

  render () {
    const { style, isTab, ...otherProps } = this.props
    const styleList = [style, styles.container]
    if (isTab) {
      styleList.push(styles.tab)
    }
    return (
      <View style={styleList} {...otherProps}>
        {this.props.children}
      </View>
    )
  }
}

const styles = PlatformStyle.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    overflow: 'hidden',
    ios: {
      paddingTop: 64
    },
    android: {
      paddingTop: 54
    }
  },
  tab: {
    marginBottom: 50
  }
})

export default PageContainer
