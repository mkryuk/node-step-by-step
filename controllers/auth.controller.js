const { tokenService } = require('../services/token.service');

class AuthController {
  constructor(tokenService) {
    this.tokenService = tokenService;
  }

  login(req, res, next) {
    return this.tokenService.createToken(req.user)
    .then((token) => {
      return res.status(200).json({
        success: true,
        token,
      });
    })
    .catch(next);
  }
}

module.exports = {
  AuthController,
  authController: new AuthController(tokenService)
};
