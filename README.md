## Contributing

### Creating Scripts

You can create a local script by going to Settings -> Script Settings -> Create Local or you can create a Scriptlist of many scripts to share with other Followall users, see the scriptlist section further down for more info.
##### Update Methods

Feeds can be fetched by the following methods
###### 'xhr'
This is a simple GET request to the feed.url or if set the feed.requestURL. The feed is processed with it's script in a processing window or iframe.
In the browser this is handled by a webextension content script. On Android the script processor window is a webview in the background. 

The simplest way to parse HTML may be to load it into a virtual document object like so:
```js
	var docObj = document.implementation.createHTMLDocument('virtual')
	
	docObj.documentElement.innerHTML = details.doc
```
Parsing JSON is as easy as using JSON.parse(details.doc)

##### 'screen' 
Web pages will be fully loaded into a browser window screen scraper. In the browser this window is called the screen scrape window and should work silently in the background. If you have any problems with pages not loading it may be to do with the browsers visibility api and covering the window with others instead of minimising the window might help the pages load.
If using 'screen' scrapePage must return a promise. Currently 'screen' scrapers can't be loaded with requestURL
If there is are no feed items found within 60 seconds the page will be refreshed for one further attempt. On Android the webpage is loaded into a webview in the background and the script is injected into the page.
#### Scraping functions

The script object can contain 2 functions, scrapePage which is ran to extract feed items from page data and generateRequestURL which is run when a script is first added or synced to create an alternate URL for scraping requests. :

```js

{ 
	"scrapePage": function scrapePage(details) {
	
		//An example with 'xhr' requested html 
		var docObj = document.implementation.createHTMLDocument('virtual')
		docObj.documentElement.innerHTML = details.doc

		var list = [].map.call(item.querySelectorAll('.list'), item => {
			return item
		})
		return {list}
	}
	"generateRequestURL": function generateRequestURL(feedURL) {
		return new Promise(function (resolve, reject) {
- 
			return return resolve({requestURL: feedURL})
		}
	}

}

```

##### scrapePage

scrapePage is the main scraping function, if the scripts 'updateMethod' is set to 'xhr' this function will be run on a script processing page with access to the document object. If 'updateMethod'  is 'screen' the scrapePage script will be run on the fully rendered page specified in feed.url or feed.requestURL. It receives a details object with the following variables:

- doc: The result of the 'xhr' request performed on the feed.url or feed.requestURL if it's set.  Available only in 'xhr' requests, in 'screen' request types the script is run on the fully rendered page and this function should interact with the document object of the page. 
- feed: The feed object containing the feed details, see below
- url: The current url string from which Followall requested the doc.

The feed object makes the following feed properties available to the script:
- name: String. The feed name
- scriptId: String. The ID of the script used to scrape the post
- updateEvery: Number. Duration in milliseconds, How often the script it updated.
- url: String URI. The default URL of the feed
- requestURL: String URI. If set it will be the location of the page from which the feed is scraped.
- lastUpdated: Number, unix timestamp. When the feed was last updated.
- updateStartTime: Number unix timestamp. When the update was started
- status: String: The current update status
- userID: String UUID. Your userID
- list: Array. An array of previously scraped posts
- errors: Array. Any update errors
- skipQueueCount: number. How many times the script has returned a new request url and skipped the update queue


An object with the following shape must be returned from scrapePage. 
- list: An array of any new posts found. A post object is detailed below.
- requestURL: String, optional. Optionally return a new requestURL to use for the further requests. Returning a requestURL will skip the update queue and your feed will get updated immediately from the new url, upto a maximum of 5 skips.

The list array in the object returned by scrapePage should contain post objects with the following properties:

- url: Required URI string. The URL of the post.
- created: Unix timestamp, number. When the post was created, if not specified a timestamp will be set during processing. 
- votes: Required number. The number of votes a post has. Used to calculate the posts place in the feed. If a string is provided the numeraljs.com package will be used to attempt to convert it into a number
- title: Optional String max 300 chars; 
- link: Optional URI string. Any outbound link that the post might have contained. Link details such as an image, title and description will be fetched from this url to display a preview of the link in the feed.
- reblogs: Optional number. How many times the post has been shared within the site. If a string is provided the numeraljs.com package will be used to attempt to convert it into a number
- commentCount: Optional number; How many comments does the post have. If a string is provided the numeraljs.com package will be used to attempt to convert it into a number
- displayName: Optional string. The name of the post's author
- username: Optional string. The username of the post's author
- profileURL: Optional string URI . Used to display a link to the post author's profile page
- images: Optional array. An array of URLs to any post images. Followall does not host any images.
- autoEmbed: Optional string of either "link" or "url". An embed of either the post.url or post.link fields will be shown below the post. Defaults to link.
- text: Optional string 300 chars max. A description or further text associated with the post


##### generateRequestURL

This is where you can control the URL the data is scraped for 'xhr' requests, it is not used with 'screen' requests and is run when the script is first added. Further changes to the feed.requestURL can be made from inside the scrapePage function by returning a new requestURL string in the return object. This function is passed the current main feed URL.

A promise containing an object with the following property needs to be returned:

- requestURL:  String URI, required. The updated requestURL. If set to 'prerun' the main scrapePage function will be run before any initial outbound xhr request allowing preliminary requests to be made. This will result in an empty doc object passed to scrapePage. 

#### Debugging scripts

After creating a local script and hitting save the screen scrape window will be reloaded. If it isn't reloaded or your newly created script isn't available try manually closing and or opening the screen scrape window. You can also try reloading the Followall feed page as it also contains an iframe which processes scripts. 
In Firefox console logs associated with the processing of xhr scripts can be seen by going to about:debugging and inspecting Followall. It may be helpful to run your script snippets in the console of the feed pages you wish to scrape before adding a local script in Followall. In Firefox locally created scripts can be tested on any page by right clicking and selecting 'Test Script' and your script then checking the pages console logs (press f12).

Debugging scripts created in Android is not currently possible.


### Creating Scriptlists

 To have your scriptlist available within Followall please fork, clone or copy all or part of this project and leave an issue or start a discussion with the location of your new scriptlist repo. Scriptlists must be public projects hosted on Github or Gitlab. Scriptlists have the following JSON format. 

#### Example Scriptlist:

```js
{
	"name": "Example scriptlist",
	"description": "Example description",
	"url": "https://github.com/FollowallDev/example-scriptlist",
	"homepage": "https://github.com/FollowallDev/example-scriptlist",
	"scripts" : [{}]
	
}
```

- name: String, required, max 250 chars. The name of your scriptlist
- description: String, required, max 1000 chars. A description for your scriptlist.
- homepage: String URI, required. The location of your scriptlist homepage
- url: URI, required. The location of your scriptlist JSON object.
- scripts: Array, required. Your scriptlist script objects, see below. Encoded scripts must match the corresponding unencoded files in your repo. You can use the tools in this repo to encode your scripts for use in Followall.

#### Example script object

Scriptlists contain an array of script objects of the following shape:

```js
{
	"id": "405dcd45-5a07-44a2-9ccf-1b3ad9bdefbc",
	"script": "",
	"name": 'Example script',
	"regex": 'example.com',
	"updateMethod": 'xhr',
	"description": 'This is how you use example script',
	"version": 1
}
```

- id : String, required. A UUID v4 unique to that script
- script: String, required. Where the scraping happens, encoded and serialized javascript functions detailed below
- name: String, required, max 250 chars. The name of the script.
- description: String, required, max 1000 chars. A description of what the script does and how to use it.
- regex: String, required. A regular expression to match urls the script can be run against
- updateMethod: String, required. Can be 'xhr' for a simple GET request or 'screen' to fully load and render the page and run the script on it, with access to the page's document object. See the Update Methods section below.
- version: Integer, optional. If set the script will only update when a greater version number is set. If not set it will always be overwritten on every update request.

#### Encoding Scraping functions

Before being made available to other Followall users in a scriplist the scraping functions in each script need to be URLencoded and serialised for transport. Serialisation is done using the serialize-javascript package available in NPM. URLencoding is done using encodeURIComponent. An example of use can be found in followallScripts.js in this package.


