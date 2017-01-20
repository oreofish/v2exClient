const ImageUtils = {

  handleImageURI: (uri) => {
    if (uri.indexOf('//') === 0) {
      return `https:${uri}`
    }
    return uri
  },

  handleTopicImageURI: (uri) => {
    return ImageUtils.handleImageURI(uri)
  },

  handleAvatarImageURI: (uri) => {
    return ImageUtils.handleImageURI(uri)
  }

}

export default ImageUtils
