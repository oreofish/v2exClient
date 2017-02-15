// @flow

import React from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import { Images } from '../Themes'
import RoundedButton from '../Components/RoundedButton'
import PageContainer from '../Components/common/PageContainer'
import { Actions as NavigationActions } from 'react-native-router-flux'

// Styles
import styles from './Styles/PresentationScreenStyle'

export default class PresentationTab extends React.Component {
  render () {
    return (
      <PageContainer isTab>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          <View style={styles.section} >
            <Text style={styles.sectionText} >
              Default screens for development, debugging, and alpha testing
              are available below.
            </Text>
          </View>

          <RoundedButton onPress={NavigationActions.camera}>
            Camera
          </RoundedButton>

          <RoundedButton onPress={NavigationActions.mapbox}>
            MapBox
          </RoundedButton>

          <View style={styles.centered}>
            <Text style={styles.subtitle}>Made with ❤️ by Infinite Red</Text>
          </View>

        </ScrollView>
      </PageContainer>
    )
  }
}
