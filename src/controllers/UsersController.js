const { hash } = require('bcryptjs');
const AppError = require('../utils/AppError');
const knex = require('../database/knex');

class UsersController {
  async create( req, res ) {
    const { name, email, password } = req.body;
    
    if ( !name || !email || !password ) {
      throw new AppError('Todos os campos são obrigatórios');
    }

    const checkUserExists = await knex.select('*').from('Users').where('email', email).first();

    if ( checkUserExists ) {
      throw new AppError('E-mail inválido para cadastrar o usuário');
    }

    const  hasedPassword = await hash(password, 8);

    await knex('Users').insert({
      name,
      email,
      password: hasedPassword,
      isAdmin: false
    });
    
    res.status(201).json({ name, email, password });
  }
}

module.exports = UsersController;