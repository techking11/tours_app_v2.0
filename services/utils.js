exports.responseError = (res, code, err = 'Tour not found !') => {
  res.status(code).json({
    status: 'fail',
    message: err,
  });
};

exports.responseSuccess = (res, code, data) => {
  res.status(code).json({
    status: 'success',
    data,
  });
};
