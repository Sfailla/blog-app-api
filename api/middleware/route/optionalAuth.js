const { verifyToken, makeAuthUser, findAndRetrieveCookie } = require('../../helpers/user-auth')
const { ValidationError } = require('../utils/errors')
const UserModel = require('../../models/user')

/*
  Optional auth is necessary because articles will be available in a feed for users
  that are logged in and users that are just browsing available articles. however if a user
  is logged in we want to show more information.  for ex... favorites/following
*/

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token')
    const rtoken = findAndRetrieveCookie(req, 'refreshToken')

    if (rtoken) {
      const verifiedUser = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET)
      const user = await UserModel.findById(verifiedUser.userId)

      if (!verifiedUser || !user) {
        const errMsg = 'error authenticating user'
        throw new ValidationError(400, errMsg)
      }
      req.user = makeAuthUser(user)
    } else {
      req.user = null
    }

    return await next()
  } catch (error) {
    console.log('opt auth error')
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      error.status = 403
      next(error)
    }
    next(error)
  }
}

module.exports = optionalAuth
