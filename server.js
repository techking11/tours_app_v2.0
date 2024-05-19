const { info } = require('console');
const app = require('./app');
const dbConnection = require('./config/connect');
require('dotenv').config();

dbConnection();

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, host, () => {
  info(process.env.NODE_ENV);
  info(`Server running at http://${host}:${port}`);
});
