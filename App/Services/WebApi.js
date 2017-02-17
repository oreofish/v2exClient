// import {AsyncStorage} from 'react-native'
import Networking from './Networking'

class V2exApi {

  static async signin (data) {
    try {
      return Networking.post('/json/login_session', data)
    } catch (error) {
      console.log('error retrieving data:', error)
    }
  }

  static getPage (uri) {
    return Networking.get(uri)
  }
}

export default V2exApi
