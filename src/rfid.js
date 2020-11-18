module.exports = {
	tag: (serialNumber) => {
		if(serialNumber == null || serialNumber.length < (5 * 5 - 1)) {
			return null;
		}
		
		var bytes = serialNumber.split(' ').filter(el => el.length != 0);
		
		return bytes.length == 5 ? bytes.join(' ') : null;
	}
};