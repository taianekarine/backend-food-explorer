const { Router } = require('express');

const userRoutes = require('./users.routes');
const productsRoutes = require('./products.routes');
const sessionsRoutes = require('./sessions.routes');

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/sessions', sessionsRoutes);
routes.use('/products', productsRoutes);

module.exports = routes;