const app = require('./app');
const dbConnection = require('./config/connect');
require('dotenv').config();

dbConnection();

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, host, () => {
  console.log(process.env.NODE_ENV);
  console.log(`Server running at http://${host}:${port}`);
});
