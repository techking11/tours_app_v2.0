const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filtering()
      .sorting()
      .limiting()
      .paginating();
    const docs = await features.query;
    if (docs.length > 0)
      res.status(200).json({
        status: 'success',
        total: docs.length,
        data: docs,
      });

    next(new AppError('No documents found !', 400));
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const query = Model.findById(req.params.id);
    if (popOptions) query.populate(popOptions);
    const doc = await query;
    if (doc)
      res.status(200).json({
        status: 'success',
        data: doc,
      });
    else next(new AppError(`No document found _id: ${req.params.id} !`, 404));
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (doc)
      res.status(200).json({
        status: 'success',
        data: doc,
      });
    next(new AppError(`No document found _id: ${req.params.id} !`, 404));
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (doc)
      res.status(200).json({
        status: 'success',
        data: doc,
      });
    next(new AppError(`No document found _id: ${req.params.id} !`, 404));
  });
