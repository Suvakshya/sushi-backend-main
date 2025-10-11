// utils/responseUtils.js
export const successResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};

export const errorResponse = (res, message, statusCode = 400, errorDetails = null) => {
  const response = {
    success: false,
    error: message,
  };

  if (errorDetails && process.env.NODE_ENV === 'development') {
    response.details = errorDetails;
  }

  res.status(statusCode).json(response);
};

export const serverErrorResponse = (res, error, statusCode = 500) => {
  console.error('Server Error:', error);
  const response = {
    success: false,
    error: 'Internal server error',
  };

  if (process.env.NODE_ENV === 'development') {
    response.details = error.message;
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
}; 