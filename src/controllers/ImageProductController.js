const knex = require('../database/knex');
const DiskStorage = require('../poviders/DiskStorage');

class ImageProductController {
  async update ( req, res ) {
    const product_id = req.params.id;
    const imageProductFilename = req.file.filename;

    const diskStorage = new DiskStorage();

    const product = await knex('Products').where({ id: product_id }).first();

    if ( product.image ) {
      await diskStorage.deleteFile(product.image)
    }

    const filename = await diskStorage.saveFile(imageProductFilename);
    product.image = filename;

    await knex('Products').update(product).where({ id: product_id });

    return res.json(product);
  }
}

module.exports = ImageProductController;