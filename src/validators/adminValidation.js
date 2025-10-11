import Joi from 'joi';

export const adminLoginValidationSchema = Joi.object({
  username: Joi.string()
    .required()
    .trim()
    .min(3)
    .max(30)
    .messages({
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username cannot exceed 30 characters',
      'any.required': 'Username is required'
    }),

  password: Joi.string()
    .required()
    .min(6)
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required'
    })
});

export const changePasswordValidationSchema = Joi.object({
  current_password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Current password is required',
      'any.required': 'Current password is required'
    }),

  new_password: Joi.string()
    .required()
    .min(6)
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'New password must be at least 6 characters',
      'any.required': 'New password is required'
    }),

  confirm_password: Joi.string()
    .required()
    .valid(Joi.ref('new_password'))
    .messages({
      'string.empty': 'Confirm password is required',
      'any.only': 'Passwords do not match',
      'any.required': 'Confirm password is required'
    })
});