const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
// im using this as a fake database. So I can read write and delete without making
// a mongoose connection.  Using readFile() and writeFile() and a JSON file.
const DATA_FILE = path.join(__dirname, '..', '..', 'data.json');

router.get('/', (req, res) => {
	res.setHeader('Cache-Control', 'no-cache');
	res.status(200).json({
		message: 'welcome to api routes 🚂'
	});
});

router.get('/projects', (req, res) => {
	res.setHeader('Cache-Control', 'no-cache');
	fs.readFile(DATA_FILE, (err, data) => {
		if (err) throw err;
		res.status(200).json(JSON.parse(data));
	});
});

router.post('/projects', (req, res) => {
	fs.readFile(DATA_FILE, (err, data) => {
		if (err) throw err;
		let projects = JSON.parse(data);
		let newProject = {
			id: req.body.id,
			title: req.body.title,
			description: req.body.description,
			author: req.body.author,
			createdAt: Date.now()
		};
		projects.push(newProject);
		fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 4), () => {
			res.setHeader('Cache-Control', 'no-cache');
			res.status(200).json(projects);
		});
	});
});

module.exports = router;
