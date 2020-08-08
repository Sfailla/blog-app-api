const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
	res.setHeader('Cache-Control', 'no-cache');
	res.status(200).json({
		message: 'welcome to api routes 🚀'
	});
});

router.get('/users', (req, res) => {
	res.send('this is /api/users route 😎');
});

module.exports = router;
