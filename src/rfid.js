/*
 * This file is part of wiattend-server project
 * https://github.com/abobija/wiattend-srv
 */

module.exports = {
	tag: (serialNumber) => {
		if(serialNumber == null || serialNumber.length < (5 * 5 - 1)) {
			return null;
		}
		
		var bytes = serialNumber.split(' ').filter(el => el.length != 0);
		
		return bytes.length == 5 ? bytes.join(' ') : null;
	}
};