import Joi from 'joi';
import mongoose from 'mongoose';

const objectIdValidation = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

export const orderItemValidationSchema = Joi.object({
  order_id: Joi.string()
    .required()
    .custom(objectIdValidation, 'ObjectId Validation')
    .messages({
      'any.required': 'Order ID is required',
      'any.invalid': 'Invalid Order ID format'
    }),

  item_id: Joi.string()
    .required()
    .custom(objectIdValidation, 'ObjectId Validation')
    .messages({
      'any.required': 'Item ID is required',
      'any.invalid': 'Invalid Item ID format'
    }),

  quantity: Joi.number()
    .required()
    .min(1)
    .messages({
      'number.base': 'Quantity must be a number',
      'number.min': 'Quantity must be at least 1',
      'any.required': 'Quantity is required'
    }),

  price: Joi.number()
    .required()
    .min(0)
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative',
      'any.required': 'Price is required'
    })
});

// Validation for order item update
export const orderItemUpdateValidationSchema = Joi.object({
  quantity: Joi.number()
    .min(1)
    .optional()
    .messages({
      'number.base': 'Quantity must be a number',
      'number.min': 'Quantity must be at least 1'
    }),

  price: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative'
    })
});