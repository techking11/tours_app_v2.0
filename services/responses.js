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

exports.responseSuccessTotal = (res, code, data) => {
  res.status(code).json({
    status: 'success',
    total: data.length,
    data,
  });
};
