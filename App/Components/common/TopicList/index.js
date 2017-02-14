import React, {Component, PropTypes} from 'react'
import {View, StatusBar, InteractionManager} from 'react-native'
import {Actions} from 'react-native-router-flux'

import moment from 'moment'

import StringUtilities from '../../../Lib/StringUtils'
import V2Networking from '../../../Services/V2exNetworking'
import GiftedListView from '../GiftedListView'
import TopicListRow from './TopicListRow'

class TopicListPage extends Component {

  static defaultProps = {
    isNode: false
  };

  static propTypes = {
    slug: PropTypes.string.isRequired,
    isNode: PropTypes.bool
  };

  onFetch = (page = 1, callback, options) => {
    const { slug, isNode } = this.props
    const uri = isNode ? `/go/${slug}` : `?tab=${slug}`
    V2Networking.get(uri)
      .then($ => {
        // Handle session status firstly
        // SessionManager.setCurrentUser($)

        const topicElements = $('#Main > div.box > div.cell.item, #Main > div.box > #TopicsNode > .cell')
        const topicList = []

        for (var index = 0; index < topicElements.length; index++) {
          var element = topicElements[index]
          const ele = $(element)

          const id = Number(StringUtilities.matchFirst(ele.find('.item_title a').attr('href'), /t\/(\d+)/))
          const title = ele.find('.item_title a').text()
          const nodeName = ele.find('a.node').text()
          const nodeURI = ele.find('a.node').attr('href')
          const authorName = ele.find('span.small.fade strong a:first-child').html() // FIXME: Why .text() would double the username?
          const authorURI = ele.find('span.small.fade strong a').attr('href')
          const replyCount = Number(ele.find('td:last-child').text())
          const authorAvatarURI = ele.find('img.avatar').attr('src')
          const pinned = ele.attr('style') !== ''
          const timeMatches = ele.find('span.small.fade').text().match(/•\s*([a-zA-Z0-9 \u4e00-\u9fa5]+)前/)
          var time = null
          if (timeMatches !== null && timeMatches.length > 0) {
            time = timeMatches[1]
          }
          const timestamp = this.parseTimeToUnix(time)

          topicList.push({
            id,
            title,
            nodeName,
            nodeURI,
            authorName,
            authorURI,
            authorAvatarURI,
            replyCount,
            time,
            timestamp,
            pinned
          })
        }

        InteractionManager.runAfterInteractions(() => {
          callback(topicList, {allLoaded: true})
        })
      }, error => {
        console.log('error:', error)
      })
  };

  parseTimeToUnix (time) {
    var days, hours, minutes, seconds

    if (time === null) {
      return 0
    } else {
      const cleanTime = time.replace(/ /g, '')
      days = Number(StringUtilities.matchFirst(cleanTime, /(\d+)天/))
      hours = Number(StringUtilities.matchFirst(cleanTime, /(\d+)小时/))
      minutes = Number(StringUtilities.matchFirst(cleanTime, /(\d+)分钟/))
      seconds = Number(StringUtilities.matchFirst(cleanTime, /(\d+)秒/))
    }

    const m = moment().subtract({ days, hours, minutes, seconds })
    return m.unix()
  }

  render () {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle={'light-content'} />
        <GiftedListView
          style={{ flex: 1 }}
          onFetch={this.onFetch}
          renderRow={this.renderRow.bind(this)} />
      </View>
    )
  }

  renderRow = (rowData) => {
    const { isNode } = this.props
    return (
      <TopicListRow isNode={isNode} onRowPress={this.onRowPress} {...rowData} />
    )
  };

  onRowPress (topicID) {
    Actions.topic({ topicID })
  }

}

export default TopicListPage
