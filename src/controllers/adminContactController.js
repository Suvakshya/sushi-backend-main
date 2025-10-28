// import Contact from '../models/adminContactModel.js';

// // Get contact information
// export const getContactInfo = async (req, res) => {
//   try {
//     const contact = await Contact.getContactInfo();

//     res.json({
//       success: true,
//       data: {
//         phone: contact.phone,
//         email: contact.email,
//         updated_at: contact.updatedAt,
//       },
//     });
//   } catch (error) {
//     console.error('Get contact info error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch contact information',
//     });
//   }
// };

// // Update contact information
// export const updateContactInfo = async (req, res) => {
//   try {
//     const { phone, email } = req.body;

//     if (!phone || !email) {
//       return res.status(400).json({
//         success: false,
//         message: 'Phone and email are required',
//       });
//     }

//     // Validate phone format (basic validation)
//     const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
//     if (!phoneRegex.test(phone)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid phone number format',
//       });
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid email format',
//       });
//     }

//     let contact = await Contact.findOne();

//     if (!contact) {
//       contact = await Contact.create({
//         phone,
//         email,
//         updated_by: req.admin.id,
//       });
//     } else {
//       contact.phone = phone;
//       contact.email = email;
//       contact.updated_by = req.admin.id;
//       await contact.save();
//     }

//     res.json({
//       success: true,
//       data: {
//         phone: contact.phone,
//         email: contact.email,
//         updated_at: contact.updatedAt,
//       },
//       message: 'Contact information updated successfully',
//     });
//   } catch (error) {
//     console.error('Update contact info error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update contact information',
//     });
//   }
// };
import Contact from '../models/adminContactModel.js';
import mongoose from 'mongoose';

// Get contact information
export const getContactInfo = async (req, res) => {
  try {
    const contact = await Contact.getContactInfo();

    res.json({
      success: true,
      data: {
        phone: contact.phone,
        email: contact.email,
        updated_at: contact.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get contact info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact information',
    });
  }
};

// Update contact information (No authentication required)
export const updateContactInfo = async (req, res) => {
  try {
    const { phone, email } = req.body;

    console.log('=== UPDATE CONTACT DEBUG ===');
    console.log('Request body:', req.body);
    console.log('============================');

    if (!phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Phone and email are required',
      });
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    let contact = await Contact.findOne();

    // Use a default admin ID since we removed authentication
    const defaultAdminId = new mongoose.Types.ObjectId();

    if (!contact) {
      contact = await Contact.create({
        phone,
        email,
        updated_by: defaultAdminId,
      });
    } else {
      contact.phone = phone;
      contact.email = email;
      contact.updated_by = defaultAdminId;
      await contact.save();
    }

    res.json({
      success: true,
      data: {
        phone: contact.phone,
        email: contact.email,
        updated_at: contact.updatedAt,
      },
      message: 'Contact information updated successfully',
    });
  } catch (error) {
    console.error('Update contact info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact information',
    });
  }
};