import { NextResponse } from 'next/server';
import Organization from '@/models/Organization';
import GenericResource from '@/models/GenericResource'; 
import dbConnect from '@/lib/dbConnect';

export async function POST(req: Request) {
  // 1. Connect to DB first!
  await dbConnect(); 

  // 2. Destructure Name and Prompt
  const { name, prompt } = await req.json();
  const lowerPrompt = prompt.toLowerCase();

  // 3. Generate Slug from the NAME (not the prompt)
  const generatedSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove special chars
    .replace(/\s+/g, '-');    // spaces to dashes

  let config = {};
  let businessType = 'Custom';

  // --- LOGIC: Decide based on the DESCRIPTION (prompt) ---
  if (lowerPrompt.includes('gym')) {
    businessType = 'Fitness Center';
    config = {
      themeColor: 'emerald',
      resources: [
        { 
          key: 'trainers', 
          label: 'Trainers', 
          singularLabel: 'Trainer',
          icon: 'users',
          fields: [{ name: 'bio', label: 'Biography', type: 'text' }] 
        },
        { 
          key: 'classes', 
          label: 'Classes', 
          singularLabel: 'Class',
          icon: 'calendar',
          fields: [{ name: 'time', label: 'Start Time', type: 'date' }] 
        }
      ]
    };
  } else if (lowerPrompt.includes('mechanic')) {
    businessType = 'Auto Repair';
    config = {
      themeColor: 'slate',
      resources: [
        { 
          key: 'mechanics', 
          label: 'Mechanics', 
          singularLabel: 'Mechanic',
          icon: 'wrench',
          fields: [{ name: 'specialty', label: 'Specialty', type: 'text' }] 
        },
        { 
          key: 'service-slots', 
          label: 'Service Bay', 
          singularLabel: 'Service Slot',
          icon: 'car',
          fields: [{ name: 'vehicle', label: 'Car Model', type: 'text' }]
        }
      ]
    };
  } else {
    // Default: Events / Conference
    businessType = 'Conference';
    config = {
      themeColor: 'indigo', 
      resources: [
        { 
          key: 'speakers', 
          label: 'Speakers', 
          singularLabel: 'Speaker',
          icon: 'mic',
          fields: [
            { name: 'name', label: 'Full Name', type: 'text' },
            { name: 'role', label: 'Job Title', type: 'text' },
            { name: 'company', label: 'Company', type: 'text' }
          ] 
        },
        { 
          key: 'sessions', 
          label: 'Agenda', 
          singularLabel: 'Session',
          icon: 'clock',
          fields: [
            { name: 'title', label: 'Session Title', type: 'text' },
            { name: 'time', label: 'Start Time', type: 'datetime' },
            { name: 'speaker', label: 'Assigned Speaker', type: 'text' }
          ] 
        },
        {
          key: 'tickets',
          label: 'Registrations',
          singularLabel: 'Ticket',
          icon: 'ticket',
          fields: [
            { name: 'attendee', label: 'Attendee Name', type: 'text' },
            { name: 'type', label: 'Ticket Type', type: 'select' } 
          ]
        }
      ]
    };
  }

  // 4. Create the Organization using the Name and calculated Business Type
  const newOrg = await Organization.create({
    name: name,             // From input
    slug: generatedSlug,    // From input name
    businessType: businessType, // Derived from prompt logic
    config: config
  });

  // 5. Seed Data (Optional: If it's an event, pre-fill it)
  if (lowerPrompt.includes('conference') || lowerPrompt.includes('event') || lowerPrompt.includes('summit')) {
    await GenericResource.create([
      {
        organizationId: newOrg._id,
        resourceType: 'speakers',
        data: { name: 'Sarah Connor', role: 'Security Consultant', company: 'Cyberdyne' }
      },
      {
        organizationId: newOrg._id,
        resourceType: 'speakers',
        data: { name: 'Tony Stark', role: 'CTO', company: 'Stark Industries' }
      },
      {
        organizationId: newOrg._id,
        resourceType: 'sessions',
        data: { title: 'The Future of AI', time: '2026-03-12 10:00 AM', speaker: 'Tony Stark' }
      }
    ]);
  }

  return NextResponse.json(newOrg.toObject());
}