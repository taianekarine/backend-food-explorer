const knex = require('../database/knex');
const AppError = require('../utils/AppError');

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await knex('Users').where({ id: userId }).first();

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Você não tem permissão para acessar este recurso.' });
    }

    next();
  } catch {
    throw new AppError('Erro interno do servidor.')
  }
}

module.exports = isAdmin;
