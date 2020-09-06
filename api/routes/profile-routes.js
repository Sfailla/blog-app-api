const express = require('express');
const ProfileController = require('../controllers/profile');
const ProfileDbService = require('../services/profile-service');
const UserModel = require('../models/user');
const authenticateJWT = require('../middleware/route/authenticate');

const router = express.Router();

const profileService = new ProfileDbService(UserModel);
const profileController = new ProfileController(profileService);

const {
	getProfile,
	followUser,
	unfollowUser,
	updateUserProfile
} = profileController;

router.get('/:username', getProfile);

router.post('/:username/follow', authenticateJWT, followUser);

router.put('/:username', authenticateJWT, updateUserProfile);

router.delete('/:username/unfollow', authenticateJWT, unfollowUser);

module.exports = router;
