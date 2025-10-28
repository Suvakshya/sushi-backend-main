import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      default: '+1 (555) 123-4567',
    },
    email: {
      type: String,
      required: true,
      default: 'contact@sushimaster.com',
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one contact document exists
contactSchema.statics.getContactInfo = async function () {
  let contact = await this.findOne();
  if (!contact) {
    contact = await this.create({
      phone: '+1 (555) 123-4567',
      email: 'contact@sushimaster.com',
      updated_by: new mongoose.Types.ObjectId(), // Default admin ID
    });
  }
  return contact;
};

const AdminContactModel = mongoose.model('adminContact', contactSchema);

export default AdminContactModel;
