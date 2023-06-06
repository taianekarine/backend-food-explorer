exports.up = knex => knex.schema.createTable('Users', table => {
  table.increments('id');
  table.text('name');
  table.text('email');
  table.text('password');
  table.boolean('isAdmin');
});

exports.down = knex => knex.schema.dropTable('Users');