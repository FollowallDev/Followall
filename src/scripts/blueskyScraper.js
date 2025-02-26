// Convert natural language times https://github.com/wanasit/chrono

const scrapePage = (details) => {

  
  let listData = []
  let parsed = JSON.parse(details.doc)

  const scrapeItem = (item) => {

    let data = item.post
    let domain = 'bsky.app/profile/'


    return {
      isReblog: false,
      title: data.record.text,
      // text: data.selftext ? data.selftext : data.body,
      text: false,
      link: data.record?.embed?.external?.uri,
      votes: data.likeCount,
      reblogs: data.repostCount,
      commentCount: data.replyCount,
      url: "https://" + domain + data.author.handle + "/post/" + data.uri.split('/').pop(), //unique url that identifies the post, not the reblog url
      created: new Date(data.record.createdAt).getTime(),
      displayName: data.author.displayName,
      username: data.author.handle,
      images: data.embed?.images?.map((img) => img.fullsize),
      profileURL: "https://" + domain +  data.author.handle,
    }
  }
console.log('blueskysc', parsed.feed);

   parsed.feed.forEach((item) => {

      let post = scrapeItem(item)
      listData.push(post)
  })

  return {list: listData}
}

const generateRequestURL = (currentURL) => {
  return new Promise(function (resolve) {

    if( new RegExp(/public.api.bsky.app/).test(currentURL)) return resolve({ requestURL: currentURL})

    let urlbits = currentURL.split('profile/')

    return resolve({ requestURL: "https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=" + urlbits[1] + "&limit=20"})


  })
}

module.exports = { scrapePage, generateRequestURL }