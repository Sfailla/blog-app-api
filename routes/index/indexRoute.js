const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
	res.status(200).json({
		message: 'hello world'
	});
});

module.exports = router;
