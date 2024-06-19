const express = require('express');
const { getOverview } = require('../../controllers/viewsController');

const viewRouter = express.Router();

viewRouter.route('/').get(getOverview);

module.exports = viewRouter;
