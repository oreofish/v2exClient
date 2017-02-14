import React, {Component} from 'react'
import {StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'

import PageContainer from '../Components/common/PageContainer'
import TopicList from '../Components/common/TopicList'
import SegmentedControl from '../Components/SegmentedControl'
import { Images } from '../Themes'

import {connect} from 'react-redux'

const tabs = [
  { slug: 'all', name: '全部' },
  { slug: 'hot', name: '最热' },
  { slug: 'r2', name: 'R2' },
  { slug: 'tech', name: '技术' },
  { slug: 'jobs', name: '酷工作' },
  { slug: 'creative', name: '创意' },
  { slug: 'play', name: '好玩' },
  { slug: 'deals', name: '交易' },
  { slug: 'qna', name: '问与答' },
  { slug: 'apple', name: 'Apple' },
  { slug: 'city', name: '城市' }
]

class DiscoveryTabPage extends Component {

  segmentedControlTitles = [];
  state = {
    index: 0
  };

  componentWillMount () {
    if (this.segmentedControlTitles.length === 0) {
      tabs.map((tab) => this.segmentedControlTitles.push(tab.name))
    }
  }

  componentDidMount () {
    Actions.refresh({
      rightButtonImage: Images.new_topic_icon,
      onRight: this.onNewTopicButtonPress
    })
  }

  onSegmentedControlButtonPress = (index) => {
    this.setState({ index })
  }

  render () {
    const titles = this.segmentedControlTitles

    return (
      <PageContainer isTab>
        <SegmentedControl buttonTitles={titles}
          ref={(ref) => {
            this.segmentedControl = ref
          }}
          onPress={this.onSegmentedControlButtonPress}
          style={styles.segmentedControl} />
        {this.renderContent()}
      </PageContainer>
    )
  }

  renderContent = () => {
    return this.renderPage(tabs[this.state.index])
  };

  renderPage (data) {
    return (
      <TopicList key={`tab_slug_${data.slug}`} slug={data.slug} />
    )
  }

  onNewTopicButtonPress = () => {
    Actions.newTopic({ nodeSlug: this.props.slug })
  }
}

const styles = StyleSheet.create({
  segmentedControl: {
    backgroundColor: '#F7F7F7',
    borderBottomColor: '#D3D2D3',
    borderBottomWidth: 0.5
  }
})

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscoveryTabPage)
