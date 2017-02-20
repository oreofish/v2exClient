// import {AsyncStorage} from 'react-native'
import Networking from './Networking'

class WebApi {

  static async signin (host, data) {
    try {
      return Networking.post(host, '/json/login_session', data)
    } catch (error) {
      console.log('error retrieving data:', error)
    }
  }

  static getPage (uri) {
    return Networking.get(uri)
  }
}

export default WebApi
