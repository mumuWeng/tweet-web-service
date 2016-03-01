# tweet-web-service

This is a set of RESTful APIs that reads from a JSON file deployed on a server and return the tweet or user information also in JSON.

## Installation

Install Node.js by following the instructions described in https://nodejs.org/en/download/package-manager.

And then execute `$ node static.js` to start the server.

Go to http://localhost:3000 for the interface.

## Usage

* Get all tweets information in the archive.
```
GET /api/tweets
```
    
* Get all known Twitter  users included in the archive.
```
GET /api/users
```

* Get all external links in the archive grouped based on Tweet ID.
```
GET /api/external_links
```
    
* Get specific tweet information. The parameter tweet's id is required.
```
GET /api/tweet?id=TWEET_ID
```

* Get specific user information. The parameter user's screen name is required.
```
GET /api/user?name=USER_SCREEN_NAME
```

Happy Tweeting.