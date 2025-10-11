// validators/faqValidator.js
import Joi from 'joi';

export const faqSchema = Joi.object({
  question: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.empty': 'Question is required',
      'string.min': 'Question should have at least 10 characters',
      'string.max': 'Question should not exceed 500 characters'
    }),

  answer: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.empty': 'Answer is required',
      'string.min': 'Answer should have at least 10 characters',
      'string.max': 'Answer should not exceed 2000 characters'
    }),

  order: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'Order must be a number',
      'number.min': 'Order cannot be negative'
    }),

  isActive: Joi.boolean()
    .default(true)
});

export const faqUpdateSchema = Joi.object({
  question: Joi.string()
    .min(10)
    .max(500)
    .optional(),

  answer: Joi.string()
    .min(10)
    .max(2000)
    .optional(),

  order: Joi.number()
    .integer()
    .min(0)
    .optional(),

  isActive: Joi.boolean()
    .optional()
});

export const validateFAQ = (req, res, next) => {
  const { error, value } = faqSchema.validate(req.body, {
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

export const validateFAQUpdate = (req, res, next) => {
  const { error, value } = faqUpdateSchema.validate(req.body, {
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