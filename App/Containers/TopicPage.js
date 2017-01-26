import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'

import TopicPage from '../Containers/Topic'
// import {navigatePush} from '../Lib/NavigationPush'

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    // TODO: Extract common push/pop actions
    pushTopicPage: (topicID) => {
      Actions.topic({ topicID })
    },
    pushUserPage: (username) => {
      Actions.user({ username })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicPage)
