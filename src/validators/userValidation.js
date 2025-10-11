import Joi from 'joi';

export const userValidationSchema = Joi.object({
  full_name: Joi.string()
    .required()
    .min(2)
    .max(100)
    .trim()
    .messages({
      'string.empty': 'Full name is required',
      'string.min': 'Full name must be at least 2 characters',
      'string.max': 'Full name cannot exceed 100 characters',
      'any.required': 'Full name is required'
    }),

  email: Joi.string()
    .required()
    .email()
    .lowercase()
    .trim()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),

  password_hash: Joi.string()
    .required()
    .min(6)
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required'
    }),

  phone_number: Joi.string()
    .required()
    .trim()
    .pattern(/^[0-9+\-\s()]+$/)
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Please provide a valid phone number',
      'any.required': 'Phone number is required'
    }),

  address: Joi.string()
    .allow('')
    .trim()
    .max(500)
    .messages({
      'string.max': 'Address cannot exceed 500 characters'
    })
});

// Validation for user update (all fields optional)
export const userUpdateValidationSchema = Joi.object({
  full_name: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .optional()
    .messages({
      'string.min': 'Full name must be at least 2 characters',
      'string.max': 'Full name cannot exceed 100 characters'
    }),

  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),

  phone_number: Joi.string()
    .trim()
    .pattern(/^[0-9+\-\s()]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),

  address: Joi.string()
    .allow('')
    .trim()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Address cannot exceed 500 characters'
    })
});

// Validation for login
export const userLoginValidationSchema = Joi.object({
  email: Joi.string()
    .required()
    .email()
    .lowercase()
    .trim()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),

  password_hash: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    })
});
