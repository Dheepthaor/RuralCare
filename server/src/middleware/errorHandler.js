export const errorHandler = (err, req, res, next) => {
  console.error('[Error Caught]:', err.message);

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    // Special message for appointment double booking
    if (err.keyPattern && err.keyPattern.doctor && err.keyPattern.appointmentDate && err.keyPattern.timeSlot) {
      return res.status(409).json({
        success: false,
        message: 'This time slot was just booked by another patient. Please select an alternate slot.',
        code: 'SLOT_ALREADY_BOOKED',
      });
    }

    return res.status(409).json({
      success: false,
      message: `An entry with this ${field} already exists.`,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join('. '),
      errors: messages,
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Resource not found with specified identifier format.`,
    });
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
