import cheerio from 'cheerio'
import axios from 'axios'
import StringUtils from '../Lib/StringUtils'

let once = null

class V2exApi {
  static getNodes () {
    const instance = v2exAxios()
    instance.interceptors.response.use((data) => {
      return data.data.map((raw) => {
        const { id, header, name: slug, title: name, topics, created } = raw
        return { id, header, slug, name, topics, created }
      })
    })

    return instance.get('/api/nodes/all.json')
  }

  static postSignin (data) {
    const headers = {
      'Referer': 'https://www.v2ex.com/signin'
    }

    return this.postPage('/signin', serializeJSON2String(data), { headers: headers })
  }

  static getPage (uri) {
    const instance = v2exAxios()
    instance.interceptors.response.use((data) => {
      const jq = cheerio.load(data.data, { decodeEntities: false })
      parseOnce(jq)
      console.log('V2exApi', once)
      return jq
    })

    return instance.get(uri)
  }

  static postPage (uri, data = null, headers = {}) {
    const instance = v2exAxios()
    instance.interceptors.response.use((data) => {
      const jq = cheerio.load(data.data, { decodeEntities: false })
      parseOnce(jq)
      console.log('V2exApi', once)
      return jq
    })

    return instance.post(uri, data, headers)
  }

  static getOnce () {
    return once
  }
}
// creates the axios instance
function v2exAxios () {
  // Set config defaults when creating the instance
  var instance = axios.create({
    baseURL: 'https://www.v2ex.com'
  })

  // Alter defaults after instance has been created
  instance.defaults.headers.common['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
  instance.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36'
  instance.defaults.headers.common['Connection'] = 'keep-alive'
  instance.defaults.timeout = 10 * 1000

/*
  if (__DEV__) {
    // Add a request interceptor for log
    instance.interceptors.request.use(function (config) {
      console.log(`================ V2exApi Request  >> ${config.method.toUpperCase()} ${config.url}`)
      if (config.data) {
        console.log(config.data)
      }
      return config;
    }, function (error) {
      console.log(error)
      return Promise.reject(error);
    });

    instance.interceptors.response.use(function (response) {
      console.log(`================ V2exApi Response << ${response.status} ${response.config.url}`)
      // if (response.data) { console.log(response.data) }
      return response;
    }, function (error) {
      console.log('*** This is not called ***');
      return Promise.reject(error);
    });
  }
*/

  return instance
}

function parseOnce ($) {
  const logOutElement = $('a:contains("登出")')
  const onClick = logOutElement.attr('onclick')
  const tempOnce = StringUtils.matchFirst(onClick, /signout\?once=(\d+)/)
  if (tempOnce) {
    once = tempOnce
  }
  return tempOnce
}

/*
// multipart form
function serializeJSON2FormData (data) {
  const fd = new FormData()
  Object.keys(data).forEach(function (keyName) {
    fd.append(keyName, data[keyName])
  })
  return fd
}
*/

function serializeJSON2String (data) {
  return Object.keys(data).map(function (keyName) {
    return `${encodeURIComponent(keyName)}=${encodeURIComponent(data[keyName])}`
  }).join('&')
}

export default V2exApi
