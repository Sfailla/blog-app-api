const { verifyToken, findAndRetrieveCookie } = require('../../helpers/user-auth')
const checkUserPermissions = require('../utils/checkPermissions')
const { ValidationError } = require('../utils/errors')

const requiredRole = userRole => async (req, res, next) => {
  try {
    if (!userRole) {
      const errMsg = 'must provide authorization role'
      throw new ValidationError(422, errMsg)
    }

    let userData

    if (req.user) {
      userData = {
        id: req.user.id,
        role: req.user.role,
        userRole
      }
    } else if (!req.user) {
      const refreshToken = findAndRetrieveCookie(req, 'refreshToken')

      if (!refreshToken) {
        const errMsg = 'no refresh token. user must log in again'
        throw new ValidationError(401, errMsg)
      }
      const verifiedToken = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET)
      userData = {
        id: verifiedToken.id,
        role: verifiedToken.role,
        userRole
      }
      req.user = verifiedToken
    }

    await checkUserPermissions(userData, ValidationError, next)
  } catch (error) {
    return next(error)
  }
}

module.exports = requiredRole
