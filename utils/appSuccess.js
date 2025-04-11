class AppSuccess {
  constructor(statusCode, data, total = undefined) {
    this.statusCode = statusCode;
    this.total = total;
    this.data = data;
  }

  select(res) {
    res.status(this.statusCode).json({
      status: 'success',
      total: this.total,
      data: this.data,
    });
  }
}

module.exports = AppSuccess;
