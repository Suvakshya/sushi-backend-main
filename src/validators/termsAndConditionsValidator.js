// validators/termsAndConditionsValidator.js
import Joi from 'joi';

export const termsAndConditionsSchema = Joi.object({
  description: Joi.string()
    .min(10)
    .max(10000)
    .required()
    .messages({
      'string.empty': 'Description is required',
      'string.min': 'Description should have at least 10 characters',
      'string.max': 'Description should not exceed 10000 characters'
    })
});

export const validateTermsAndConditions = (req, res, next) => {
  const { error, value } = termsAndConditionsSchema.validate(req.body, {
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