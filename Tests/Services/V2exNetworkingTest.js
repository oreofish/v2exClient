import test from 'ava'
import V2exApi from '../../App/Services/WebApi'
import fetchMock from 'fetch-mock'

test('http request to v2ex: signin form', (t) => {
  var mockPage = "<input type='text' class='sl' name='792563391c82c39dcccc036049f900bda3751352299401d619bb3b7d9e7ace7a' value='' placeholder='用户名或电子邮箱地址'>"
  mockPage += "<input type='password' class='sl' name='5787af1921ff96b17e88c7c8df5aeaa8ab55c012a67766f083efe68a906fc645' value=''>"
  mockPage += "<input type='hidden' value='33347' name='once'>"
  fetchMock.get('*', mockPage)

  V2exApi.getSigninForm().then((usernameFieldName, passwordFieldName, once) => {
    t.is(usernameFieldName, '792563391c82c39dcccc036049f900bda3751352299401d619bb3b7d9e7ace7a')
    t.is(passwordFieldName, '5787af1921ff96b17e88c7c8df5aeaa8ab55c012a67766f083efe68a906fc645')
    t.is(once, '33347')

    fetchMock.restore() // unmock
  })
})

