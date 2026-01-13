import { Schema, model, models } from 'mongoose';

const OrganizationSchema = new Schema({
  name: { type: String, required: true }, // e.g., "Joe's Mechanic Shop"
  slug: { type: String, unique: true },   // e.g., "joes-mechanics"
  businessType: { type: String },         // e.g., "mechanic"
  
  // THE MAGIC: This JSON defines their dashboard
  config: {
    resources: [{
      key: String,        // e.g., "mechanics" (internal ID)
      label: String,      // e.g., "Mechanics" (Sidebar Name)
      singularLabel: String, // e.g., "Mechanic"
      icon: String,       // e.g., "wrench"
      fields: [           // What data do we collect for them?
        { name: String, type: String, label: String } 
      ]
    }],
    themeColor: String    // e.g., "slate-600"
  }
});

export default models.Organization || model('Organization', OrganizationSchema);