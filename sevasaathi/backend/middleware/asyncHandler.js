// Wraps async controller functions so we don't need try/catch everywhere.
// Any thrown error is passed to Express's error-handling middleware.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
