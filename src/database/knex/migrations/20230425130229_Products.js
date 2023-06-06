exports.up = knex => knex.schema.createTable('Products', table => {
  table.increments('id');
  table.text('image');
  table.integer('user_id').references('id').inTable('Users').onDelete('CASCADE');
  table.text('title');
  table.text('description');
  table.text('categorie');
  table.integer('price');
});

exports.down = knex => knex.schema.dropTable('Products');