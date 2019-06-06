/*
 * This file is part of wiattend-server project
 * https://github.com/abobija/wiattend-srv
 */

const app    = require('express')();
const db     = require('mysql');
const config = require('./config');
const rfid   = require('./rfid');
const ws     = require('express-ws')(app);

let wsResponse = (eventName, obj) => {
	return JSON.stringify({
		event: eventName,
		data: obj
	});
};

let wsBroadcast = (eventName, obj) => {
	for(let _ws of ws.getWss().clients) {
		_ws.send(wsResponse(eventName, obj));
	}
};

app.ws('/', _ws => {});

app.post('/log', (req, res) => {
	res.statusCode = 400;
	
	if (req.headers['sguid'] === '2ce81521-c42f-4556-8c28-c69d7e3a3a47' && req.headers['rfid-tag'] != null) {
		let rfidUid = rfid.tag(req.headers['rfid-tag']);
		
		if(rfidUid != null) {
			console.log('Received tag:', rfidUid);
			
			let conn = db.createConnection(config.mysql);
			
			conn.connect(err => {
				if(err) throw err;
				
				conn.query("SELECT t.*,"
					+ " (SELECT COALESCE((SELECT l.`direction` FROM `log` l WHERE `tag_id` = t.id ORDER BY l.`id` DESC LIMIT 1) * -1, 1)) AS next_direction"
					+ " FROM `tag` t WHERE t.`uid` = '" + rfidUid + "'", (err, tags) => {
					if(err) throw err;
					
					if(tags.length == 0) {
						res.end();
					} else {
						let tag = tags[0];
						
						conn.query('INSERT INTO `log`(`tag_id`, `direction`) VALUES(' + tag.id + ', ' + tag.next_direction + ')', (err, insertLogResult)  => {
							if(err) throw err;
							
							res.statusCode = 200;
							res.write(JSON.stringify(tag));
							res.end();

							wsBroadcast('logged', tag);
						});
					}
				});
			});
		}
	} else {
		res.end();
	}
});

app.listen(config.port, () => console.log('Server has been started.'));