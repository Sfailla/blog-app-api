module.exports = class ProfileController {
  constructor(databaseService) {
    this.service = databaseService
  }

  getProfile = async (req, res, next) => {
    try {
      const { profile, err } = await this.service.fetchUserProfile(req.params.username)
      if (err) throw err
      return await res.status(200).json({ profile })
    } catch (error) {
      return next(error)
    }
  }

  followUser = async (req, res, next) => {
    try {
      const username = req.params.username
      const { profile, err } = await this.service.followService(req.user, username)
      if (err) throw err
      return await res.status(200).json({
        message: `now following author: ${username}`,
        profile
      })
    } catch (error) {
      return next(error)
    }
  }

  unfollowUser = async (req, res, next) => {
    try {
      const username = req.params.username
      const { profile, err } = await this.service.unfollowService(req.user, username)
      if (err) throw err
      return await res.status(200).json({
        message: `unfollowed author: ${username}`,
        profile
      })
    } catch (error) {
      return next(error)
    }
  }

  updateUserProfile = async (req, res, next) => {
    try {
      const username = req.user.username
      const { profile, err } = await this.service.findProfileAndUpdate(req.user, req.body)
      if (err) throw err
      return await res.status(200).json({
        message: `successfully updated profile: ${username}`,
        profile
      })
    } catch (error) {
      next(error)
    }
  }
}
