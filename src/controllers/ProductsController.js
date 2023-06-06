const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const DiskStorage = require('../poviders/DiskStorage');

class ProductsController {
  async create ( req, res ) {
    const { title, description, price, categorie, ingredients } = req.body;
    const user_id = req.user.id;
    const imageProductFilename = req.file.filename;

    const diskStorage = new DiskStorage();

    const filename = await diskStorage.saveFile(imageProductFilename);

    const [ product_id ] = await knex('Products').insert({
      title,
      description,
      price,
      categorie,
      user_id: user_id,
      image: filename
    });

    const ingredientsInsert = ingredients.split(',').map( name => {
      return {
        product_id,
        user_id: user_id,
        name,
        categorie,
      }
    });

    await knex('Ingredients').insert(ingredientsInsert);

    return res.status(201).json();
  };

  async update ( req, res ) {
    const { id } = req.params;
    const { title, description, price, categorie, ingredients } = req.body;
    const userAuthenticated = req.user.id;
    const imageProductFilename = req.file.filename;

    const diskStorage = new DiskStorage();

    const filename = await diskStorage.saveFile(imageProductFilename);

    const product = await knex.select('*').from('Products').where({ id });
    const userCreateProduct = await knex.select('user_id').from('Products').where({ id }).first();
    const imageProduct = await knex.select('image').from('Products').where({ id });

    if ( userCreateProduct.user_id !== userAuthenticated) {
      throw new AppError('Você não tem autorização para editar este produto.')
    }
  
    if ( !product ) {
      throw new AppError('Produto não encontrado');
    };

    product.filename = filename ?? product.filename;
    product.title = title ?? product.title;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.categorie = categorie ?? product.categorie;

    await knex('Products').where({ id })
    .update({
      image: product.filename,
      title: product.title,
      description: product.description,
      price: product.price,
      categorie: product.categorie
    });

    // Atualiza os ingredientes
    const ingredientsInsert = ingredients.split(',').map( name => {
      return {
        product_id: req.params.id,
        user_id: req.user.id,
        name,
        categorie,
      }
    });

    const ingredientsLength = await knex('Ingredients').where({ product_id: id })

    if ( ingredientsLength.length >= 0 ) {
      await knex('Ingredients').where({ product_id: id }).delete();
    }

    await knex('Ingredients').insert(ingredientsInsert);

    return res.json();
  };

  async show ( req, res ) {
    const { id } = req.params;

    const product = await knex('Products').where('id', id).first();
    const ingredients = await knex('Ingredients').where({ product_id: id }).select('name').orderBy('name');

    const convertIngredients = ingredients.map( (ingredient) => ingredient.name)
    return res.json({
      product,
      convertIngredients
    });
  };

  async index(req, res) {
  const { title } = req.query;

  const ingredient = await knex('Products')
    .select('Products.id', 'Products.title', 'Products.categorie', 'Products.description', 'Products.price', 'Products.image')
    .whereRaw('LOWER(Products.title) LIKE ?', [`%${title.toLowerCase()}%`])
    .innerJoin('Ingredients', 'product_id', 'Products.id')
    .groupBy('Products.id');

  return res.json(ingredient);
}

  async delete ( req, res ) {
    const { id } = req.params;
    const userAuthenticated = req.user.id;

    const userCreateProduct = await knex.select('user_id').from('Products').where({ id }).first();

    if ( userCreateProduct.user_id !== userAuthenticated) {
      throw new AppError('Você não tem autorização para deletar este produto.')
    }

    const deleteProduct = await knex('Products').where({ id }).delete();
    const deleteIngredints = await knex('Ingredients').where( 'product_id' , id ).delete();

    return res.json({   
      deleteProduct,
      deleteIngredints
    });
  };
}

module.exports = ProductsController;