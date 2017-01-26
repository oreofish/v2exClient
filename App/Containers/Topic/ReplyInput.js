import React, {Component, PropTypes} from 'react'
import {View, TextInput, ActivityIndicator, Alert} from 'react-native'
import Button from 'react-native-button'

import Networking from '../../Services/V2exNetworking'
import PlatformStyle from '../../Lib/PlatformStyle'

class ReplyInput extends Component {
  static defaultProps = {};
  static propTypes = {
    topicID: PropTypes.number.isRequired,
    onReplySucceed: PropTypes.func.isRequired
  };
  state = {
    content: '',
    isSubmitting: false
  };

  render () {
    const { isSubmitting } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <TextInput
            multiline
            underlineColorAndroid='transparent' style={styles.textInput}
            onChangeText={content => this.setState({ content })} />
        </View>
        {isSubmitting ? <ActivityIndicator style={styles.replyButton} /> : <Button
          onPress={this.onSubmit} containerStyle={styles.replyButton} style={styles.replyButtonText}>回复</Button>}
      </View>
    )
  }

  onSubmitProcessing = () => {
    this.setState({ isSubmitting: true })
  };

  onSubmitEnd = () => {
    this.setState({ isSubmitting: false })
  };

  onSubmit = async() => {
    const { content } = this.state
    if (!content || content.length < 1) {
      Alert.alert('回复失败', '内容不能为空')
      return
    }
    this.onSubmitProcessing()
    try {
      const $ = await Networking.post(`/t/${this.props.topicID}`, {
        content,
        once: Networking.getOnce()
      })
      const problemMessage = $('.problem ul li').text()
      if (problemMessage) {
        Alert.alert('回复失败', problemMessage)
      } else {
        this.props.onReplySucceed($)
      }
    } catch (error) {
      Alert.alert(error)
    } finally {
      this.onSubmitEnd()
    }
  };

}

const styles = PlatformStyle.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderTopColor: '#CCCCDE',
    borderTopWidth: 1,
    paddingLeft: 12,
    paddingRight: 12
  },
  inputWrapper: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    borderColor: '#CCCCDE',
    borderWidth: 1,
    borderRadius: 5
  },
  textInput: {
    flex: 1,
    height: 28,
    fontSize: 15,
    marginLeft: 5,
    marginRight: 5,
    android: {
      height: 32,
      fontSize: 11
    }
  },
  replyButton: {
    marginLeft: 10
  },
  replyButtonText: {
    fontSize: 15
  }
})

export default ReplyInput
