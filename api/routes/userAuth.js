const { Router } = require('express');
const controller = require('../controllers/userAuth');

const router = Router();

/**
 * =============================
 * 	USER AUTH ROUTES
 * =============================
 */

router.get('/users', controller.getUser);

router.post('/users', controller.createUser);

module.exports = router;
