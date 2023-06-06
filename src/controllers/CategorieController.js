const knex = require('../database/knex');
class CategorieController  {
  async index ( req, res ) {
    const { category } = req.params;
    
    const products = await knex('Products').where({ categorie: category });
    const ingredients = await knex('Ingredients').where({ categorie: category }).orderBy('name');
    
    return res.json({ products, ingredients });

  }
}

module.exports = CategorieController;