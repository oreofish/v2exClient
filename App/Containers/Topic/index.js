import React, {Component, PropTypes} from 'react'
import {View, ListView, ActivityIndicator, InteractionManager, Platform, ActionSheetIOS, Alert} from 'react-native'
import {Actions} from 'react-native-router-flux'

import StringUtils from '../../Lib/StringUtils'
import V2exApi from '../../Services/V2exApi'
import PlatformStyle from '../../Lib/PlatformStyle'

import CustomKeyboardSpacer from '../../Components/common/CustomKeyboardSpacer'
import PageContainer from '../../Components/common/PageContainer'
import TopicHeader from './TopicHeader'
import Post from './Post'
import ReplyInput from './ReplyInput'

import { Images } from '../../Themes'

class TopicPage extends Component {

  constructor (props) {
    super(props)

    this.state = {
      topic: {},
      posts: [],
      dataSource: null,
      reportLink: null
    }
  }

  componentDidMount () {
    InteractionManager.runAfterInteractions(() => {
      this.loadTopic()
    })
    this.setUpNavigationBar()
  }

  setUpNavigationBar = () => {
    if (Platform.OS === 'ios') {
      Actions.refresh({
        onRight: this.onRightButtonPress,
        rightButtonTextStyle: { color: 'white' },
        rightButtonImage: Images.action_icon
      })
    }
  };

  onRightButtonPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['报告这个主题', '取消'],
          cancelButtonIndex: 1,
          destructiveButtonIndex: 0
        },
        (index) => {
          if (index === 0) {
            this.reportTopic()
          }
        }
      )
    }
  };

  reportTopic = () => {
    const { reportLink, isReported } = this.state
    if (isReported) {
      Alert.alert('您已报告过此主题', '请不要重复提交')
    } else if (reportLink) {
      V2exApi.getPage(reportLink).then(() => {
        Alert.alert('我们已收到您的报告', '感谢您的参与')
      }).catch(() => {
        Alert.alert('网络错误', '报告失败')
      })
    } else {
      Alert.alert('您尚未登录', '无法提交报告')
    }
  };

  render () {
    return (
      <PageContainer>
        <View style={styles.postList}>
          {this.renderPosts()}
        </View>
        <ReplyInput topicID={this.props.topicID} onReplySucceed={($) => this.loadTopic($)} />
        <CustomKeyboardSpacer />
      </PageContainer>
    )
  }

  renderPosts () {
    if (!this.state.dataSource) {
      return <ActivityIndicator style={{ marginTop: 20 }} />
    } else {
      return (
        <ListView
          style={{ flex: 1 }}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)} />
      )
    }
  }

  renderRow (rowData) {
    if (rowData.title) {
      return <TopicHeader {...rowData} />
    }
    return <Post {...rowData} />
  }

  loadTopic = ($ = null) => {
    if ($) {
      this.parseTopic($)
    } else {
      V2exApi.getPage(`/t/${this.props.topicID}`)
        .then($ => {
          this.parseTopic($)
        })
    }
  };

  parseTopic = ($) => {
    // Parse topic
    const _topicMetaElement = $($('#Main div.box .header'))
    const title = _topicMetaElement.find('h1').text()
    const topicID = Number(StringUtils.matchFirst(_topicMetaElement.find('div.votes').attr('id'), /topic_(\d+)_votes/))
    const replyCount = Number(StringUtils.matchFirst($('#Main div.box .cell span.gray').text(), /(\d+) 回复/))
    const topicContent = $('#Main .box .topic_content').html()
    // const postscript = $('#Main .box .subtle').html();
    // TODO: Find a better regex expression for Chinese
    const topicTime = StringUtils.betterV2TimeString(StringUtils.matchFirst(_topicMetaElement.find('small.gray').text(), / · ([a-zA-Z0-9 \u4E00-\u9FA5\uF900-\uFA2D]+) ·/))

    // TODO: Implement appreciation count and favourite count for topic:
    // const _topicOtherInfoElementText = $('#Main .box .topic_buttons .fr').text();
    // const appreciationCount = Number(StringUtils.matchFirst(_topicOtherInfoElementText, /(\d+) 人感谢/));
    // const favoriteCount = Number(StringUtils.matchFirst(_topicOtherInfoElementText, /(\d+) 人收藏/));

    // Parse author of topic
    const authorName = _topicMetaElement.find('small.gray > a').text()
    const authorAvatarURI = _topicMetaElement.find('.fr > a > img').attr('src')

    // Parse node
    const _nodeElement = $('#Main .box .header > a:nth-child(4)')
    const nodeName = _nodeElement.text()
    const nodeSlug = StringUtils.matchFirst(_nodeElement.attr('href'), /\/go\/(\w{1,31})/)

    const topic = {
      id: topicID,
      title: title,
      replyCount,
      nodeName,
      nodeSlug
    }

    // Parse replies
    const posts = []

    posts.push(topic)

    // Push data of topic into `posts` array
    posts.push({
      id: 0,
      content: topicContent,
      authorAvatarURI: authorAvatarURI,
      authorName,
      time: topicTime,
      floor: 0,
      appreciationCount: 0
    })

    const _replyElements = $('#Main > div:nth-child(4) > .cell')
    for (var index = 1; index < _replyElements.length; index++) { // Start from second element, because the first is about tags
      const _element = $(_replyElements[index])

      // console.log(_element.attr('class'), _element.hasClass('normalUser'));
      const replyID = Number(StringUtils.matchFirst(_element.attr('id'), /r_(\d{1,15})/))
      if (!replyID) {
        // If there is no replyID, it might be a pagination element
        continue
      }
      const replyContent = _element.find('.reply_content').html()
      const replyAuthorAvatarURI = _element.find('img.avatar').attr('src')
      const replyAuthorName = _element.find('strong a').text()

      const time = StringUtils.betterV2TimeString(_element.find('span[class="fade small"]').text())
      const floor = Number(_element.find('span.no').text())
      const replyAppreciationCount = Number(StringUtils.matchFirst(_element.find('span[class="small fade"]').text(), /♥ (\d+)/))

      posts.push({
        id: replyID,
        content: replyContent,
        authorAvatarURI: replyAuthorAvatarURI,
        authorName: replyAuthorName,
        time,
        floor,
        appreciationCount: replyAppreciationCount
      })
    }

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        return r1.id !== r2.id
      }
    })

    // Parse report link
    const reportElement = $('a:contains("报告这个主题")')
    const reportLink = StringUtils.matchFirst(reportElement.attr('onclick'), /(\/report\/.+)'/)
    let isReported = false
    const reportedSpanText = $('span:contains("你已对本主题进行了报告")').text()
    if (reportedSpanText) {
      isReported = true
    }

    this.setState({ posts, dataSource: ds.cloneWithRows(posts), reportLink, isReported })
  };

}

TopicPage.propTypes = {
  topicID: PropTypes.number.isRequired
}

const styles = PlatformStyle.create({
  postList: {
    flex: 1
  }
})

export default TopicPage
