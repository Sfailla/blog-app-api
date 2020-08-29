const express = require('express');
const ProfileController = require('../controllers/profile');
const ProfileDbService = require('../services/profile-service');
const UserModel = require('../models/user');

const router = express.Router();

const profileService = new ProfileDbService(UserModel);
const profileController = new ProfileController(profileService);

router.get('/:username', profileController.getProfile);

module.exports = router;
