exports.up = knex => knex.schema.createTable('Ingredients', table => {
  table.increments('id');
  table.integer('product_id').references('id').inTable('Products').onDelete('CASCADE');
  table.integer('user_id').references('id').inTable('Users').onDelete('CASCADE');
  table.text('name').notNullable();
  table.text('categorie').notNullable();
});

exports.down = knex => knex.schema.dropTable('Ingredients');