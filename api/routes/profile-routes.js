const express = require('express');
const ProfileController = require('../controllers/profile');
const ProfileDbService = require('../services/profile-service');
const UserModel = require('../models/user');
const authenticateJWT = require('../middleware/route/authenticate');

const router = express.Router();

const profileService = new ProfileDbService(UserModel);
const profileController = new ProfileController(profileService);

router.get('/:username', profileController.getProfile);

router.post(
	'/:username/follow',
	authenticateJWT,
	profileController.followUser
);

router.delete(
	'/:username/unfollow',
	authenticateJWT,
	profileController.unfollowUser
);

module.exports = router;
