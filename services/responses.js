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
