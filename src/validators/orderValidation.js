import Joi from 'joi';
import mongoose from 'mongoose';

const objectIdValidation = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

export const orderValidationSchema = Joi.object({
  user_id: Joi.string()
    .required()
    .custom(objectIdValidation, 'ObjectId Validation')
    .messages({
      'any.required': 'User ID is required',
      'any.invalid': 'Invalid User ID format'
    }),

  total_price: Joi.number()
    .required()
    .min(0)
    .messages({
      'number.base': 'Total price must be a number',
      'number.min': 'Total price cannot be negative',
      'any.required': 'Total price is required'
    }),

  order_type: Joi.string()
    .required()
    .valid('Delivery', 'Takeaway')
    .messages({
      'any.only': 'Order type must be either Delivery or Takeaway',
      'any.required': 'Order type is required'
    }),

  payment_method: Joi.string()
    .required()
    .valid('Cash', 'Card', 'Online')
    .messages({
      'any.only': 'Payment method must be Cash, Card, or Online',
      'any.required': 'Payment method is required'
    }),

  status: Joi.string()
    .valid('Pending', 'Preparing', 'Out for Delivery', 'Completed', 'Cancelled')
    .default('Pending')
    .messages({
      'any.only': 'Status must be one of: Pending, Preparing, Out for Delivery, Completed, Cancelled'
    })
});

// Validation for order update (status update mostly)
export const orderUpdateValidationSchema = Joi.object({
  status: Joi.string()
    .valid('Pending', 'Preparing', 'Out for Delivery', 'Completed', 'Cancelled')
    .messages({
      'any.only': 'Status must be one of: Pending, Preparing, Out for Delivery, Completed, Cancelled'
    }),

  total_price: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Total price must be a number',
      'number.min': 'Total price cannot be negative'
    })
});