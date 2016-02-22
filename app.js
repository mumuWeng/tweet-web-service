var http = require('http'), fs = require('fs');

fs.readFile('./index.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    
});

http.createServer(function(request, response) {  
	fs.readFile('./index.html', function (err, html) {
		if (err) {
        	throw err; 
    	}   
        response.writeHead(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    });

    fs.readFile('./style.css', function (err, css) {
		if (err) {
        	throw err; 
    	}   
        response.writeHead(200, {"Content-Type": "text/css"});  
        response.write(css);  
        response.end();  
    });

}).listen(3000);