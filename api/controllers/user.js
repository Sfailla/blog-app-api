module.exports = class AuthController {
  constructor(databaseService) {
    this.service = databaseService
  }

  // may need below to expose tokens to client
  // res.set('Access-Control-Expose-Headers', 'x-auth-token', 'x-refresh-token');
  // res.set('Access-Control-Allow-Headers', 'x-auth-token', 'x-refresh-token');

  registerUser = async (req, res, next) => {
    try {
      const { user, err } = await this.service.createUser(req.body)
      const { token, refreshToken } = await this.service.createUserTokens(user)

      if (err) throw err

      await this.service.createProfile(user)
      await this.service.createRefreshTokenCookie(res, refreshToken)

      res.set('x-auth-token', token)
      res.set('x-refresh-token', refreshToken)
      return await res.status(201).json({
        message: `successfully created user: ${user.username}`,
        user
      })
    } catch (error) {
      return next(error)
    }
  }

  loginUser = async (req, res, next) => {
    try {
      const { user, err } = await this.service.getUserByEmailAndPassword(req.body, req)
      if (err) throw err

      const { token, refreshToken } = await this.service.createUserTokens(user)
      await this.service.createRefreshTokenCookie(res, refreshToken)

      res.set('x-auth-token', token)
      res.set('x-refresh-token', refreshToken)

      return await res.status(200).json({ user })
    } catch (error) {
      return next(error)
    }
  }

  logoutUser = async (req, res, next) => {
    await this.service.destroyRefreshTokenOnLogout(req, res)
    return await res.json({
      message: 'user successfully logged out!'
    })
  }

  getUserById = async (req, res, next) => {
    try {
      const { user, err } = await this.service.getUserById(req.params.id)
      if (err) throw err
      return await res.status(200).json({ user })
    } catch (error) {
      return next(error)
    }
  }

  getAllUsers = async (req, res, next) => {
    console.log('route hit')
    try {
      const { users, err } = await this.service.getAllUsers()
      console.log({ users, err })
      if (err) throw err
      return await res.status(200).json({ users })
    } catch (error) {
      return next(error)
    }
  }

  deleteUser = async (req, res, next) => {
    try {
      const { user, err } = await this.service.findAndRemoveUser(req.user, req.params.id)
      if (err) throw err
      return await res.status(200).json({
        message: `successfully removed user: ${user.username}`,
        user
      })
    } catch (error) {
      next(error)
    }
  }

  refreshTokens = async (req, res, next) => {
    try {
      const { token, refreshToken, user, err } = await this.service.refreshUserTokens(req, res)
      if (err) throw err
      res.set('x-auth-token', token)
      res.set('x-refresh-token', refreshToken)
      return await res.status(200).json({
        token,
        refreshToken,
        user
      })
    } catch (error) {
      next(error)
    }
  }
}
