
class Networking {
  static get (host, uri) {
    return Networking.request(host, 'GET', uri, null, null, true)
  }

  static post (host, uri, data, additionalHeaders = null) {
    const headers = Object.assign({ 'Content-Type': 'application/json' }, additionalHeaders)
    return Networking.request(host, 'POST', uri, headers, data)
  }

  static request (host, method, uri, additionalHeaders = null, additionalOptions = null) {
    // TODO: Check user's setting for http/https

    const headers = Object.assign({
      'Accept': 'text/html,application/json,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36'
    }, additionalHeaders)

    const options = Object.assign({
      method,
      headers
    }, additionalOptions)

    return fetch(`https://${host}${uri}`, options)
  }
}

/* function serializeJSON2FormData (data) {
  return Object.keys(data).map(function (keyName) {
    return `${encodeURIComponent(keyName)}=${encodeURIComponent(data[keyName])}`
  }).join('&')
} */

export default Networking
