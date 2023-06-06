const { verify } = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const authConfig = require('../config/auth');

const ensureAuthenticated = async ( req, res, next ) => {
  const authHeader = req.headers.authorization;

  if ( !authHeader ) {
    throw new AppError(' JWT Token inválido')
  }

  const [ , token] = authHeader.split(' ');

  try {
    const { sub: user_id } = verify(token, authConfig.jwt.secret);
    req.user = {
      id: Number(user_id)
    }

    return next();

  } catch {
    throw new AppError('JWT Token não informado');
  }
}

module.exports = ensureAuthenticated;