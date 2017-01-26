import React, { Component, PropTypes } from 'react'

import PageContainer from '../../Components/common/PageContainer'
import GiftedListView from '../../Components/common/GiftedListView'

class UserReply extends Component {

  static propTypes = {
    username: PropTypes.string.isRequired
  };

  render () {
    return (
      <PageContainer>
        <GiftedListView onFetch={this.onFetch} renderRow={this.renderRow} renderSeparator={this.renderSeparator} />
      </PageContainer>
    )
  }

  onFetch = async (page = 1, callback, options) => {
    // const {username} = this.props
    // try {
      // const $ = await V2exApi.getPage(`/member/${username}/replies?p=${page}`)
      // const { allLoaded } = HTMLHelper.parsePagination($)
      // const replies = []
      // $('#Main > div.box > div.dock_area').each((_i, _e) => {
      //   const _dockRow = $(_e)
      // })
    // } catch (e) {
    // }
  };

}

export default UserReply
