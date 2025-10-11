// import Joi from 'joi';

// export const menuItemValidationSchema = Joi.object({
//   name: Joi.string()
//     .required()
//     .trim()
//     .min(2)
//     .max(100)
//     .messages({
//       'string.empty': 'Name is required',
//       'string.min': 'Name must be at least 2 characters',
//       'string.max': 'Name cannot exceed 100 characters',
//       'any.required': 'Name is required'
//     }),

//   description: Joi.string()
//     .required()
//     .trim()
//     .min(10)
//     .max(500)
//     .messages({
//       'string.empty': 'Description is required',
//       'string.min': 'Description must be at least 10 characters',
//       'string.max': 'Description cannot exceed 500 characters',
//       'any.required': 'Description is required'
//     }),

//   price: Joi.number()
//     .required()
//     .min(0)
//     .messages({
//       'number.base': 'Price must be a number',
//       'number.min': 'Price cannot be negative',
//       'any.required': 'Price is required'
//     }),

//   category: Joi.string()
//     .required()
//     .valid('sushi', 'sashimi', 'drinks', 'appetizers', 'desserts')
//     .messages({
//       'any.only': 'Category must be one of: sushi, sashimi, drinks, appetizers, desserts',
//       'any.required': 'Category is required'
//     }),

//   image_url: Joi.string()
//     .uri()
//     .allow('')
//     .trim()
//     .messages({
//       'string.uri': 'Image URL must be a valid URL'
//     }),

//   is_available: Joi.boolean()
//     .default(true)
//     .messages({
//       'boolean.base': 'Availability must be true or false'
//     })
// });

// // Validation for menu item update (all fields optional)
// export const menuItemUpdateValidationSchema = Joi.object({
//   name: Joi.string()
//     .trim()
//     .min(2)
//     .max(100)
//     .optional()
//     .messages({
//       'string.min': 'Name must be at least 2 characters',
//       'string.max': 'Name cannot exceed 100 characters'
//     }),

//   description: Joi.string()
//     .trim()
//     .min(10)
//     .max(500)
//     .optional()
//     .messages({
//       'string.min': 'Description must be at least 10 characters',
//       'string.max': 'Description cannot exceed 500 characters'
//     }),

//   price: Joi.number()
//     .min(0)
//     .optional()
//     .messages({
//       'number.base': 'Price must be a number',
//       'number.min': 'Price cannot be negative'
//     }),

//   category: Joi.string()
//     .valid('sushi', 'sashimi', 'drinks', 'appetizers', 'desserts')
//     .optional()
//     .messages({
//       'any.only': 'Category must be one of: sushi, sashimi, drinks, appetizers, desserts'
//     }),

//   image_url: Joi.string()
//     .uri()
//     .allow('')
//     .trim()
//     .optional()
//     .messages({
//       'string.uri': 'Image URL must be a valid URL'
//     }),

//   is_available: Joi.boolean()
//     .optional()
//     .messages({
//       'boolean.base': 'Availability must be true or false'
//     })
// });
import Joi from 'joi';

export const menuItemValidationSchema = Joi.object({
  name: Joi.string().required().trim(),
  description: Joi.string().required().trim(),
  price: Joi.number().min(0).required(),
  category: Joi.string().valid('sushi', 'sashimi', 'drinks', 'appetizers', 'desserts').required(),
  is_available: Joi.boolean().default(true)
  // Note: image_url is not included as it will be handled by multer/cloudinary
});

export const menuItemUpdateValidationSchema = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string().trim(),
  price: Joi.number().min(0),
  category: Joi.string().valid('sushi', 'sashimi', 'drinks', 'appetizers', 'desserts'),
  is_available: Joi.boolean()
  // Note: image_url is not included as it will be handled by multer/cloudinary
});