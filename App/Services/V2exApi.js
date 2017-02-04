import {AsyncStorage} from 'react-native'
import Networking from './V2exNetworking'

const NODE_LIST_KEY = 'NODE_LIST'
const NODE_LIST_EXPIRES_IN = 432000

class V2exApi {
  static async _getRemoteNodeList () {
    return Networking.getJSON('/api/nodes/all.json').then(res => res.json()).then(json => json.map((raw) => {
      const { id, header, name: slug, title: name, topics, created } = raw
      return { id, header, slug, name, topics, created }
    }))
  }

  static async getNodes () {
    try {
      let data = await AsyncStorage.getItem(NODE_LIST_KEY)
      data = data ? JSON.parse(data) : null
      const timestamp = Date.now() / 1000 | 0
      if (data === null || timestamp() - data.lastModified > NODE_LIST_EXPIRES_IN) {
        console.log('fetch nodes')
        const newNodes = await this._getRemoteNodeList()
        await AsyncStorage.setItem(NODE_LIST_KEY, JSON.stringify({ lastModified: timestamp(), newNodes }))
        return newNodes
      } else {
        console.log('nodes exists')
        const { nodes } = data
        return nodes
      }
    } catch (error) {
      console.log('error retrieving data:', error)
    }
  }

  static async postSignin (data) {
    return Networking.post('/signin', data, { 'Referer': 'https://www.v2ex.com/signin' })
  }

  static async getSigninForm () {
    try {
      let $ = await Networking.request('GET', '/signin')
      const usernameFieldName = $('input[placeholder="用户名或电子邮箱地址"]').attr('name')
      const passwordFieldName = $('input[type="password"]').attr('name')
      const once = $('input[name="once"]').attr('value')
      return {usernameFieldName, passwordFieldName, once}
    } catch (error) {
      console.log('error when getting post token:', error)
    }
  }

  static getPage (uri) {
    return Networking.get(uri)
  }
}

export default V2exApi
