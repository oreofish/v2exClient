import React, {Component, PropTypes} from 'react'
import {Actions} from 'react-native-router-flux'

import TopicList from '../../Components/common/TopicList'
import PageContainer from '../../Components/common/PageContainer'

import { Images } from '../../Themes'

class NodePage extends Component {
  static propTypes = {
    slug: PropTypes.string.isRequired
  };
  state = {};

  render () {
    const { slug } = this.props
    return (
      <PageContainer>
        <TopicList isNode slug={slug} />
      </PageContainer>
    )
  }

  componentDidMount () {
    Actions.refresh({
      rightButtonImage: Images.new_topic_icon,
      onRight: this.onNewTopicButtonPress
    })
  }

  onNewTopicButtonPress = () => {
    Actions.newTopic({ nodeSlug: this.props.slug })
  }

}

export default NodePage
