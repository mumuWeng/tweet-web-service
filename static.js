http    = require('http');
url     = require('url');
fs      = require('fs');


MIME_TYPES = {
    'js'    : 'text/javascript',
    'css'   : 'text/css',
    'html'  : 'text/html',
    'json'  : 'application/javascript'
};


http.createServer(function(request, response) { 
    // Respond with html, css, and javascript file.
    if (request.url == '/') {
    	fs.readFile('./index.html', function (err, html) {
    		if (err) {
            	throw err; 
        	}   
            response.writeHead(200, { "Content-Type": MIME_TYPES['html'] });  
            response.write(html);  
            response.end();  
        });
    }

    if (request.url.indexOf('.js') != -1) {
        fs.readFile('./app.js', function(err, js) {
            if (err) {
                throw err;
            }
            response.writeHead(200, {"Content-Type": MIME_TYPES['js'] });
            response.write(js);
            response.end();
        });
    }

    if (request.url.indexOf('.css') != -1 ) {
        fs.readFile('./style.css', function (err, css) {
    		if (err) {
            	throw err; 
        	}   
            response.writeHead(200, { "Content-Type": MIME_TYPES['css']  });  
            response.write(css);  
            response.end();  
        });
    }


    // Respond with all tweets information in the archive.
    if (request.url == '/api/tweets') {
        fs.readFile('./favs.json', function(err, json) {
            if (err) {
                throw err;
            }

            var jsonContent = JSON.parse(json);
            var jsonLength = jsonContent.length;
            var result = []

            for (var i=0; i <= jsonLength - 1; i++) {
                result.push({
                    'id': jsonContent[i].id,
                    'created_at': jsonContent[i].created_at,
                    'text': jsonContent[i].text
                })
            }

            response.writeHead(200, { "Content-Type": MIME_TYPES['json']  });  
            response.write(JSON.stringify(result));  
            response.end();
        })
    }

    // Respond with all know twitter users in the archive.
    if (request.url == '/api/users') {
        fs.readFile('./favs.json', function(err, json) {
            if (err) {
                throw err;
            }

            var jsonContent = JSON.parse(json);
            var jsonLength = jsonContent.length;
            var result = []
            var include_ids = []

            for (var i=0; i <= jsonLength - 1; i++) {
                if (isNotEmpty(jsonContent[i].user)) {
                    var user_info = jsonContent[i].user;
                    user = getUserInfo(user_info, include_ids);
                    result.push(user);
                    include_ids.push(user.id);
                }

                if (isNotEmpty(jsonContent[i].entities)) {
                    if (isNotEmpty(jsonContent[i].entities.user_mentions)) {
                        var user_info = jsonContent[i].entities.user_mentions
                        var user_length = user_info.length;
                        if (user_length > 0) {
                            for (var j = 0 ; j <= user_length-1; j++) {
                                user = getUserInfo(user_info[j], include_ids)
                                result.push(user);
                                include_ids.push(user.id);
                            }
                        }
                    }
                }
            }

            response.writeHead(200, { "Content-Type": MIME_TYPES['json'] });  
            response.write(JSON.stringify(result));  
            response.end();
        })
    }

    // Respond with all of the external links in the archive.
    if (request.url == '/api/external_links') {
        fs.readFile('./favs.json', function(err, json) {
            if (err) {
                throw err;
            }

            var jsonContent = JSON.parse(json);
            var jsonLength = jsonContent.length;
            var result = [];

            for (var i=0; i <= jsonLength-1; i++) {
                var data = {};
                data.id = jsonContent[i].id;
                data.links = [];
                var string_json = JSON.stringify(jsonContent[i]).match(/(http|https):(.*?)("|\(|\s)/g)
                for(var j=0; j <= string_json.length-1; j++) {
                    string_json[j] = string_json[j].replace(/\\/g, '').replace(',', "").replace('"',"").replace('(',"").trim();
                    if (data.links.indexOf(string_json[j]) == -1) {
                        data.links.push(string_json[j]);
                    }
                }
                result.push(data);

            }
            response.writeHead(200, { "Content-Type": MIME_TYPES['json'] });  
            response.write(JSON.stringify(result));  
            response.end();
        })
    }


    // Get the parameter tweet id and respond with the specific tweet information
    if (urlParams = url.parse(request.url, true).query) {
        if (request.url == ('/api/tweet?id=' + urlParams.id )) {
            fs.readFile('./favs.json', function(err, json) {
                if (err) {
                    throw err;
                }

                var id = urlParams.id;
                var jsonContent = JSON.parse(json);
                var jsonLength = jsonContent.length;
                var result = []

                for (var i = 0; i <= jsonLength - 1; i++) {
                    if (jsonContent[i].id == id) {
                        result.push({
                            'id': jsonContent[i].id,
                            'created_at': jsonContent[i].created_at,
                            'text': jsonContent[i].text
                         })
                    }
                }

                response.writeHead(200, { "Content-Type": MIME_TYPES['json'] });  
                response.write(JSON.stringify(result));  
                response.end();

            });
        }

        // Get the parameter screen name and respond with the specific user information.
        if (request.url == '/api/user?name=' + urlParams.name) {
            fs.readFile('./favs.json', function(err, json) {
                if (err) {
                    throw err;
                }

                var name = urlParams.name;
                var jsonContent = JSON.parse(json);
                var jsonLength = jsonContent.length;
                var result = []
                var include_ids = []

                for (var i = 0; i <= jsonLength - 1; i++) {
                    if (isNotEmpty(jsonContent[i].user)) {
                        var user_info = jsonContent[i].user;
                        if (user_info.screen_name == name) {
                            user = getUserInfo(user_info, include_ids);
                            result.push(user);
                            include_ids.push(user.id);
                        }
                    }

                    if (isNotEmpty(jsonContent[i].entities)) {
                        if (isNotEmpty(jsonContent[i].entities.user_mentions)) {
                            var user_info = jsonContent[i].entities.user_mentions
                            var user_length = user_info.length;
                            if (user_length > 0) {
                                for (var j = 0 ; j <= user_length-1; j++) {
                                    if (user_info[j].screen_name == name) {
                                        user = getUserInfo(user_info[j], include_ids)
                                        result.push(user);
                                        include_ids.push(user.id);
                                    }
                                }
                            }
                        }
                    }
                }
                response.writeHead(200, { "Content-Type": MIME_TYPES['json'] });  
                response.write(JSON.stringify(result));  
                response.end();
            });

        }
    }
}).listen(3000);

// This is a function to test in an hash is empty.
function isNotEmpty(object) {
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            return true;
        }
    }
    return false;
}

// This is a function to organize the user data into a hash and to test if there's any null field
function getUserInfo(user_info, ids) {
    var user = {};
    if (ids.indexOf(user_info.id) == -1) {
        user.id = user_info.id;
                            
        if (user_info.name) {
            user.name = user_info.name;
        }
        
        if (user_info.screen_name) {
            user.screen_name = user_info.screen_name;
        }

        if (user_info.location) {
            user.location = user_info.location;
        }

        if (user_info.description) {
            user.description = user_info.description;
        }

        if (user_info.url) {
            user.url = user_info.url;
        }

        if (user_info.id) {
            user.id = user_info.id;
        }
        return user;
    }
    return null;
}