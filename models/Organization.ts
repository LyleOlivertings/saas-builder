import { Schema, model, models } from 'mongoose';

const OrganizationSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  businessType: { type: String },
  
  // THE MAGIC: This JSON defines their dashboard
  config: {
    resources: [{
      key: String,
      label: String,
      singularLabel: String,
      icon: String,
      fields: [{ 
        name: String,
        label: String,
        // FIX: Wrap 'type' in an object so Mongoose knows it's a field name
        type: { type: String } 
      }]
    }],
    themeColor: String
  }
}, { timestamps: true });

export default models.Organization || model('Organization', OrganizationSchema);