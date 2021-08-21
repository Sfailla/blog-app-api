const express = require('express')
const ProfileController = require('../controllers/profile')
const ProfileDbService = require('../services/profile')
const ProfileModel = require('../models/profile')
const authenticateJWT = require('../middleware/route/authenticate')

const router = express.Router()

const profileService = new ProfileDbService(ProfileModel)
const profileController = new ProfileController(profileService)

const { getProfile, followUser, unfollowUser, updateUserProfile } = profileController

router.get('/:username', getProfile)

router.post('/:username/follow', authenticateJWT, followUser)

router.put('/update-profile', authenticateJWT, updateUserProfile)

router.delete('/:username/unfollow', authenticateJWT, unfollowUser)

module.exports = router
