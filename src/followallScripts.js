const bluesky = require('./scripts/blueskyScraper');
const serialize = require('serialize-javascript');

var list = {
    "name": "Followall Example Scriptlist",
    "description": "Remote scripts for Followall",
    "homepage": "https://github.com/FollowallDev/example-scriptlist",
    "url": "",
    "scripts": [
        {
            "id": "0e36716f-7496-4619-b9bd-4b7ab98e7161",
            "script": encodeURIComponent(serialize(bluesky)),
            "name": "Bluesky",
            "regex": "bsky.app|public.api.bsky.app",
            "updateMethod": "xhr",
            "description": "Bluesky profiles with votes and images",
        },

    ]
}
module.exports =  list