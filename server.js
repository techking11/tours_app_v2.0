const { info, error } = require('console');
require('dotenv').config();

process.on('uncaughtException', (err) => {
  error('UNHANDLED REJECTION ! Shutting down ...');
  error(err.name, err.message);
  process.exit(1);
});

const app = require('./app');
const dbConnection = require('./config/connect');

dbConnection();

const port = process.env.PORT;
const host = process.env.HOST;

const server = app.listen(port, host, () => {
  info(process.env.NODE_ENV);
  info(`Server running at http://${host}:${port}`);
});

process.on('unhandledRejection', (err) => {
  error('UNHANDLED REJECTION ! Shutting down ...');
  error(err.name, err.message);
  server.close(() => process.exit(1));
});
