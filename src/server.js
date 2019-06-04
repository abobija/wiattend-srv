/*
 * This file is part of wiattend-server project
 * https://github.com/abobija/wiattend-srv
 */

(function() {
	var http = require('http');
	var mysql = require('mysql');
	
	var tagUid = function(rfidTagStr) {
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
				
				var rfidTagUid = tagUid(req.headers['rfid-tag']);
				
				if(rfidTagUid != null) {
					var conn = mysql.createConnection({
						host     : 'localhost',
						user     : 'root',
						password : '00000000',
						database : 'wiattend'
					});
					
					conn.connect(function(err) {
						if(err) throw err;
						
						conn.query("SELECT * FROM `tag` WHERE `uid` = '" + rfidTagUid + "'", function(err, tags) {
							if(tags.length == 0) {
								res.end();
							} else {
								var tag = tags[0];
								
								console.log(tag);
								
								res.statusCode = 200;
								
								res.end();
							}
						});
					});
				}
			} else {
				res.end();
			}
		}).listen(port);
	};
})()