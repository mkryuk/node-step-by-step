const jsonwebtoken = require('jsonwebtoken');
const config = require('../config');

class TokenService {
  constructor(jwt, secretTokenKey) {
    this.jwt = jwt;
    this.secretTokenKey = secretTokenKey;
  }

  createToken(user) {
    return new Promise((resolve, reject) => {
      const token = this.jwt.sign({
        id: user.id,
        login: user.email,
      }, this.secretTokenKey, {
        expiresIn: 86400,
      });
      resolve(token);
    });
  }
}

module.exports = {
  TokenService,
  tokenService: new TokenService(jsonwebtoken, config.SECRET_TOKEN_KEY)
}
