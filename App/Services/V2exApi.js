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

  console.log('V2exApi', '================ ')
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

export default V2exApi
