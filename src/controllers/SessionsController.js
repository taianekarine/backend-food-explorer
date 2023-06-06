const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const { compare } = require('bcryptjs');
const authConfig = require('../config/auth');
const { sign } = require('jsonwebtoken');

class SessionsController {
  async create ( req, res ) {
    const { email, password } = req.body;

    const user = await knex('Users').where({ email }).first();

    if ( !user ) {
      throw new AppError('E-mail e/ou senha incorretos');
    }

    const passwordMatched = await compare(password, user.password);

    if ( !passwordMatched ) {
      throw new AppError('E-mail e/ou senha incorretos');
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign( {}, secret, {
      subject: String(user.id),
      expiresIn
    })
    
    return res.json({ user, token });
  }
}

module.exports = SessionsController;