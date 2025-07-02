const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message,
  });
};

const validateSearchRequest = (req, res, next) => {
  const { origin, destination, departure_date } = req.body;
  if (!origin || !destination || !departure_date) {
    return res.status(400).json({
      success: false,
      message: "origin, destination, and departure_date are required",
    });
  }
  next();
};

module.exports = { errorHandler, validateSearchRequest };
