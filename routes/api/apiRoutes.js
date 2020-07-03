const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
// im using this as a fake database. So I can read write and delete without making
// a mongoose connection.  Using readFile() and writeFile() and a JSON file.
const DATA_FILE = path.join(__dirname, '..', '..', 'data.json');

router.get('/', (req, res) => {
	res.status(200).json({
		message: 'welcome to api routes 🎢'
	});
});

router.get('/data', (req, res) => {
	fs.readFile(DATA_FILE, (err, data) => {
		if (err) throw err;
		let file = JSON.parse(data);
		res.status(200).json({
			data: file
		});
	});
});

module.exports = router;
