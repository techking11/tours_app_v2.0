const tours = require('../models/toursModel');

exports.checkId = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length)
    res.status(404).json({
      status: 404,
      message: 'Unfortunately: tour not found',
    });
  next();
};
