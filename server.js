/*
 * This file is part of wiattend-server project
 * https://github.com/abobija/wiattend-srv
 */

(function() {
	var http = require('http');
	
	var _tag = function(rfidTagStr) {
		if(rfidTagStr == null || rfidTagStr.length < (5 * 5 - 1)) {
			return null;
		}
		
		var bytes = rfidTagStr
			.split (' ')
			.filter(function(el) { return el.length != 0; });
		
		if(bytes.length != 5) {
			return null;
		}
		
		return bytes.join(' ');
	};
	
	exports.start = function (port) {
		var secretGuid = '2ce81521-c42f-4556-8c28-c69d7e3a3a47';
		
		http.createServer(function (req, res) {
			res.statusCode = 400;
			
			if (req.method === 'POST' 
				&& req.url === '/log' 
				&& req.headers['sguid'] === secretGuid
				&& req.headers['rfid-tag'] != null) {
				
				var tag = _tag(req.headers['rfid-tag']);
				
				if(tag != null) {
					res.statusCode = 200;
					
					console.log(tag);
				}
			}
			
			res.end();
		}).listen(port);
	};
})()