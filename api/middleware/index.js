const authenticateJWT = require('./route/authenticate')
const requiredRole = require('./route/requiredRole')
const optionalAuth = require('./route/optionalAuth')

// export our middlewares to prevent multiple imports
module.exports = {
  authenticateJWT,
  optionalAuth,
  requiredRole
}
