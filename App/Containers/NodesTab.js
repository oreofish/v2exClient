// @flow

// An All Components Screen is a great way to dev and quick-test components
import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import PageContainer from '../Components/common/PageContainer'

import {Actions} from 'react-native-router-flux'

import PlatformStyle from '../Lib/PlatformStyle'
// import NodeListManager from '../../../utilities/node_list_manager'
import V2exApi from '../Services/V2exApi'

import HomepageNodeData from '../Fixtures/homepage_node_data.json'
import GiftedListView from '../Components/common/GiftedListView'
import Separator from '../Components/common/Separator'
import TouchableRow from '../Components/common/TouchableRow'

// Examples Render Engine
// import ExamplesRegistry from '../Services/ExamplesRegistry'

class NodesTab extends Component {

  searchMode = false;

  constructor (props) {
    super(props)
    this.state = {}

    this.onFetch = this.onFetch.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.renderNodeElement = this.renderNodeElement.bind(this)

    this.initializeNodes()
  }

  async initializeNodes () {
    try {
      this.nodes = await V2exApi.getNodes()
    } catch (error) {
      console.log('error:', error)
    }
  }

  render () {
    return (
      <PageContainer isTab>
        <GiftedListView
          onFetch={this.onFetch}
          renderRow={this.renderRow}
          pagination={false}
          refreshable
          enableSearch
          searchOnChange
        />
      </PageContainer>
    )
  }

  onFetch = (page = 1, callback, options) => {
    const { search, keywords } = options
    if (search) {
      this.searchMode = true
      const lowerKeywords = keywords.toLowerCase()
      if (this.nodes) {
        const filteredNodes = this.nodes.filter((node) => {
          const { slug, name } = node
          if (slug && name && (slug.toLowerCase().indexOf(lowerKeywords) > -1 || name.toLowerCase().indexOf(lowerKeywords) > -1)) {
            return true
          } else {
            return false
          }
        })
        callback(filteredNodes)
      } else {
        this.initializeNodes()
      }
    } else {
      this.searchMode = false
      callback(HomepageNodeData)
    }
  };

  renderRow = (rowData) => {
    if (this.searchMode) {
      return this.renderSearchResultRow(rowData)
    } else {
      return this.renderNormalRow(rowData)
    }
  };

  renderNormalRow = (rowData) => {
    const { category_name: categoryName, nodes } = rowData
    return (
      <View style={styles.row}>
        <View style={styles.nodeCategoryWrapper}>
          <Text style={styles.nodeCategory}> {categoryName}</Text>
        </View>
        <View style={styles.nodeContainer}>
          {nodes.map((node) => this.renderNodeElement(node))}
        </View>
      </View>
    )
  };

  renderSearchResultRow = (rowData) => {
    const { slug, name } = rowData
    return (
      <View style={styles.searchResultRow}>
        <TouchableRow style={{flex: 1}} innerViewStyle={{justifyContent: 'center'}}
          onPress={() => this.onNodePress(slug, name)}>
          <Text style={styles.searchResultRowText}>{name}（{slug}）</Text>
        </TouchableRow>
        <Separator marginLeft={0} />
      </View>
    )
  };

  renderNodeElement = (node) => {
    const { slug, name } = node
    return (
      <View key={slug} style={styles.nodeWrapper}>
        <TouchableOpacity onPress={() => this.onNodePress(slug, name)}>
          <Text style={styles.nodeText}>{name}</Text>
        </TouchableOpacity>
      </View>
    )
  };

  onNodePress (slug, name) {
    Actions.node({slug, title: name})
  }

}

const styles = PlatformStyle.create({
  row: {
    overflow: 'hidden'
  },
  nodeCategoryWrapper: {
    height: 39,
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: '#EAEAEA'
  },
  nodeCategory: {
    marginLeft: 16,
    color: '#333333'
  },
  nodeContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 10,
    paddingRight: 10,
    overflow: 'hidden'
  },
  nodeWrapper: {
    height: 30,
    borderWidth: 0.5,
    borderColor: '#B0B0B3',
    borderRadius: 15,
    justifyContent: 'center',
    marginBottom: 15,
    marginLeft: 5,
    marginRight: 5
  },
  nodeText: {
    marginLeft: 10,
    marginRight: 10,
    color: '#333333'
  },

  // Search
  searchResultRow: {
    height: 44,
    marginLeft: 12
  },
  searchResultRowTextWrapper: {
    flex: 1
  },
  searchResultRowTextInnerWrapper: {
    justifyContent: 'center'
  },
  searchResultRowText: {
    fontSize: 14
  }

})

export default NodesTab
