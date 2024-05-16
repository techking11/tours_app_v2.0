exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price)
    res.status(404).json({ status: 400, message: 'Missing name or price' });
  next();
};
