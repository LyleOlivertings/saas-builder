import { Schema, model, models } from 'mongoose';

const OrganizationSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  businessType: { type: String },
  
  // FUTURE-PROOFING:
  ownerId: { type: String, index: true }, // Who created this? (For Super-Admin later)
  status: { 
    type: String, 
    enum: ['active', 'suspended', 'archived'], 
    default: 'active' 
  },
  
  config: {
    resources: [{
      key: String,
      label: String,
      singularLabel: String,
      icon: String,
      fields: [{ name: String, type: String, label: String }]
    }],
    themeColor: String
  }
}, { timestamps: true }); // Automatically adds createdAt / updatedAt

export default models.Organization || model('Organization', OrganizationSchema);