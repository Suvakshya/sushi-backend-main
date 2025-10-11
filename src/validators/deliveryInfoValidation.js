import Joi from 'joi';
import mongoose from 'mongoose';

const objectIdValidation = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

export const deliveryInfoValidationSchema = Joi.object({
  order_id: Joi.string()
    .required()
    .custom(objectIdValidation, 'ObjectId Validation')
    .messages({
      'any.required': 'Order ID is required',
      'any.invalid': 'Invalid Order ID format'
    }),

  delivery_address: Joi.string()
    .required()
    .min(5)
    .messages({
      'string.empty': 'Delivery address is required',
      'string.min': 'Delivery address must be at least 5 characters',
      'any.required': 'Delivery address is required'
    }),

  delivery_time: Joi.date()
    .required()
    .messages({
      'date.base': 'Delivery time must be a valid date',
      'any.required': 'Delivery time is required'
    }),

  delivery_status: Joi.string()
    .valid('Pending', 'Out for Delivery', 'Delivered')
    .default('Pending')
    .messages({
      'any.only': 'Delivery status must be one of: Pending, Out for Delivery, Delivered'
    }),

  delivery_person: Joi.string()
    .allow('')
    .optional()
    .messages({
      'string.base': 'Delivery person must be a string'
    })
});