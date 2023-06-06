require('express-async-errors');
require('dotenv/config');
const database = require('./database/sqlite');
const express = require('express');
const routes = require('./routes');
const AppError = require('./utils/AppError');
const uploadConfig = require('./config/upload');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(routes);
app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER));

database();

app.use((error, req, res, next) => {

  if ( error instanceof AppError ) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  };

  console.error(error);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });

})

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => { console.log(`Server is running on PORT ${PORT}`)});