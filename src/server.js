/*
 * This file is part of wiattend-server project
 * https://github.com/abobija/wiattend-srv
 */

(function() {
	const http = require('http');
	const mysql = require('mysql');
	
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
					console.log(rfidTagUid);
								
					var conn = mysql.createConnection({
						host     : 'localhost',
						user     : 'root',
						password : '00000000',
						database : 'wiattend'
					});
					
					conn.connect(function(err) {
						if(err) throw err;
						
						conn.query("SELECT t.*,"
							+ " (SELECT COALESCE((SELECT l.`direction` FROM `log` l WHERE `tag_id` = t.id ORDER BY l.`id` DESC LIMIT 1) * -1, 1)) AS next_direction"
							+ " FROM `tag` t WHERE t.`uid` = '" + rfidTagUid + "'", function(err, tags) {
							if(err) throw err;
							
							if(tags.length == 0) {
								res.end();
							} else {
								var tag = tags[0];
								
								conn.query('INSERT INTO `log`(`tag_id`, `direction`) VALUES(' + tag.id + ', ' + tag.next_direction + ')', function(err, insertLogResult) {
									if(err) throw err;
									
									res.statusCode = 200;
									res.write(JSON.stringify(tag));
									res.end();
								});
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