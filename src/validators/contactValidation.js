// // validators/contactValidator.js
// import Joi from 'joi';

// export const contactSchema = Joi.object({
//   name: Joi.string()
//     .min(2)
//     .max(50)
//     .required()
//     .pattern(/^[a-zA-Z\s]+$/)
//     .messages({
//       'string.empty': 'Name is required',
//       'string.min': 'Name should have at least 2 characters',
//       'string.max': 'Name should not exceed 50 characters',
//       'string.pattern.base': 'Name should contain only letters and spaces'
//     }),

//   email: Joi.string()
//     .email()
//     .required()
//     .messages({
//       'string.empty': 'Email is required',
//       'string.email': 'Please provide a valid email address'
//     }),

//   mobileNumber: Joi.string()
//     .pattern(/^[0-9]{10}$/)
//     .required()
//     .messages({
//       'string.empty': 'Mobile number is required',
//       'string.pattern.base': 'Mobile number must be exactly 10 digits'
//     }),

//   description: Joi.string()
//     .max(500)
//     .optional()
//     .allow('')
//     .messages({
//       'string.max': 'Description should not exceed 500 characters'
//     })
// });

// // Validation middleware
// export const validateContact = (req, res, next) => {
//   const { error, value } = contactSchema.validate(req.body, {
//     abortEarly: false,
//     stripUnknown: true
//   });

//   if (error) {
//     const errorDetails = error.details.map(detail => ({
//       field: detail.path[0],
//       message: detail.message
//     }));
    
//     return res.status(400).json({
//       success: false,
//       message: 'Validation failed',
//       errors: errorDetails
//     });
//   }

//   req.validatedData = value;
//   next();
// };

// // Optional: Partial validation for updates
// export const validateContactUpdate = (req, res, next) => {
//   const updateSchema = contactSchema.fork(
//     ['name', 'email', 'mobileNumber', 'description'],
//     field => field.optional()
//   );

//   const { error, value } = updateSchema.validate(req.body, {
//     abortEarly: false,
//     stripUnknown: true
//   });

//   if (error) {
//     const errorDetails = error.details.map(detail => ({
//       field: detail.path[0],
//       message: detail.message
//     }));
    
//     return res.status(400).json({
//       success: false,
//       message: 'Validation failed',
//       errors: errorDetails
//     });
//   }

//   req.validatedData = value;
//   next();
// };
// validators/contactValidator.js
import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name should have at least 2 characters',
      'string.max': 'Name should not exceed 50 characters',
      'string.pattern.base': 'Name should contain only letters and spaces'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),

  mobileNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.empty': 'Mobile number is required',
      'string.pattern.base': 'Mobile number must contain only digits'
    }),

  description: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Description should not exceed 500 characters'
    })
});

// Validation middleware
export const validateContact = (req, res, next) => {
  const { error, value } = contactSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorDetails = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorDetails
    });
  }

  req.validatedData = value;
  next();
};

// Optional: Partial validation for updates
export const validateContactUpdate = (req, res, next) => {
  const updateSchema = contactSchema.fork(
    ['name', 'email', 'mobileNumber', 'description'],
    field => field.optional()
  );

  const { error, value } = updateSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorDetails = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorDetails
    });
  }

  req.validatedData = value;
  next();
};