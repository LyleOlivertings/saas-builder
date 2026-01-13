import { Schema, model, models } from 'mongoose';

export interface IGenericResource {
  organizationId: Schema.Types.ObjectId;
  resourceType: string; // e.g., "speakers", "mechanics", "classes"
  data: Record<string, any>; // Flexible JSON payload: { name: "Tony", role: "Stark" }
}

const GenericResourceSchema = new Schema<IGenericResource>(
  {
    organizationId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Organization', 
      required: true, 
      index: true 
    },
    resourceType: { 
      type: String, 
      required: true, 
      index: true 
    },
    // The "Mixed" type allows us to store any shape of data the AI generates
    data: { 
      type: Schema.Types.Mixed, 
      required: true 
    },
  },
  { timestamps: true }
);

// Prevent model recompilation error in Next.js hot reload
export default models.GenericResource || model<IGenericResource>('GenericResource', GenericResourceSchema);