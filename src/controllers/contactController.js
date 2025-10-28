// // controllers/contactController.js
// import Contact from '../models/contactModel.js';
// import { contactSchema } from '../validators/contactValidation.js';

// // Create contact
// export const createContact = async (req, res) => {
//   try {
//     // Validate request body
//     const { error, value } = contactSchema.validate(req.body);
    
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: error.details.map(detail => detail.message)
//       });
//     }

//     // Check if email already exists
//     const existingEmail = await Contact.isEmailTaken(value.email);
//     if (existingEmail) {
//       return res.status(400).json({
//         success: false,
//         message: 'Contact creation failed',
//         errors: ['Email already exists']
//       });
//     }

//     // Check if mobile number already exists
//     const existingMobile = await Contact.isMobileTaken(value.mobileNumber);
//     if (existingMobile) {
//       return res.status(400).json({
//         success: false,
//         message: 'Contact creation failed',
//         errors: ['Mobile number already exists']
//       });
//     }

//     const contact = new Contact(value);
//     await contact.save();

//     res.status(201).json({
//       success: true,
//       message: 'Contact created successfully',
//       data: contact
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // Get all contacts
// export const getAllContacts = async (req, res) => {
//   try {
//     const contacts = await Contact.find().sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data: contacts,
//       count: contacts.length
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // Get contact by ID
// export const getContactById = async (req, res) => {
//   try {
//     const contact = await Contact.findById(req.params.id);

//     if (!contact) {
//       return res.status(404).json({
//         success: false,
//         message: 'Contact not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: contact
//     });

//   } catch (error) {
//     if (error.name === 'CastError') {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid contact ID'
//       });
//     }
    
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // Update contact
// export const updateContact = async (req, res) => {
//   try {
//     const { error, value } = contactSchema.validate(req.body);
    
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: error.details.map(detail => detail.message)
//       });
//     }

//     // Check if email is being updated and if it's already taken
//     if (value.email) {
//       const emailTaken = await Contact.isEmailTaken(value.email, req.params.id);
//       if (emailTaken) {
//         return res.status(400).json({
//           success: false,
//           message: 'Contact update failed',
//           errors: ['Email already exists']
//         });
//       }
//     }

//     // Check if mobile number is being updated and if it's already taken
//     if (value.mobileNumber) {
//       const mobileTaken = await Contact.isMobileTaken(value.mobileNumber, req.params.id);
//       if (mobileTaken) {
//         return res.status(400).json({
//           success: false,
//           message: 'Contact update failed',
//           errors: ['Mobile number already exists']
//         });
//       }
//     }

//     const contact = await Contact.findByIdAndUpdate(
//       req.params.id,
//       value,
//       { new: true, runValidators: true }
//     );

//     if (!contact) {
//       return res.status(404).json({
//         success: false,
//         message: 'Contact not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Contact updated successfully',
//       data: contact
//     });

//   } catch (error) {
//     if (error.name === 'CastError') {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid contact ID'
//       });
//     }
    
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // Delete contact
// export const deleteContact = async (req, res) => {
//   try {
//     const contact = await Contact.findByIdAndDelete(req.params.id);

//     if (!contact) {
//       return res.status(404).json({
//         success: false,
//         message: 'Contact not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Contact deleted successfully',
//       data: contact
//     });

//   } catch (error) {
//     if (error.name === 'CastError') {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid contact ID'
//       });
//     }
    
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // Search contacts by name or email
// export const searchContacts = async (req, res) => {
//   try {
//     const { q } = req.query;
    
//     if (!q) {
//       return res.status(400).json({
//         success: false,
//         message: 'Search query is required'
//       });
//     }

//     const contacts = await Contact.find({
//       $or: [
//         { name: { $regex: q, $options: 'i' } },
//         { email: { $regex: q, $options: 'i' } }
//       ]
//     }).sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data: contacts,
//       count: contacts.length
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // Get contact by email
// export const getContactByEmail = async (req, res) => {
//   try {
//     const contact = await Contact.findOne({ email: req.params.email });

//     if (!contact) {
//       return res.status(404).json({
//         success: false,
//         message: 'Contact not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: contact
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // Get contact by mobile number
// export const getContactByMobile = async (req, res) => {
//   try {
//     const contact = await Contact.findOne({ mobileNumber: req.params.mobileNumber });

//     if (!contact) {
//       return res.status(404).json({
//         success: false,
//         message: 'Contact not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: contact
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };
// controllers/contactController.js
import Contact from '../models/contactModel.js';
import { contactSchema } from '../validators/contactValidation.js';

// Create contact
export const createContact = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = contactSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Remove unique email and mobile number checks since we allow duplicates

    const contact = new Contact(value);
    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: contact
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all contacts
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: contacts,
      count: contacts.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get contact by ID
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update contact
export const updateContact = async (req, res) => {
  try {
    const { error, value } = contactSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Remove unique constraint checks for email and mobile number

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: contact
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete contact
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully',
      data: contact
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Search contacts by name or email
export const searchContacts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const contacts = await Contact.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: contacts,
      count: contacts.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get contact by email
export const getContactByEmail = async (req, res) => {
  try {
    const contact = await Contact.findOne({ email: req.params.email });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get contact by mobile number
export const getContactByMobile = async (req, res) => {
  try {
    const contact = await Contact.findOne({ mobileNumber: req.params.mobileNumber });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};