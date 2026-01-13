import { NextResponse } from 'next/server';
import Organization from '@/models/Organization';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const lowerPrompt = prompt.toLowerCase();

  let config = {};

  // LOGIC: Decide the structure based on keywords
 if (lowerPrompt.includes('gym')) {
    // ... existing gym logic
  } else if (lowerPrompt.includes('conference') || lowerPrompt.includes('event') || lowerPrompt.includes('summit')) {
    config = {
      themeColor: 'indigo', // Professional Blue/Purple for events
      resources: [
        { 
          key: 'speakers', 
          label: 'Speakers', 
          singularLabel: 'Speaker',
          icon: 'mic',
          fields: [
            { name: 'name', type: 'text', label: 'Full Name' },
            { name: 'role', type: 'text', label: 'Job Title' },
            { name: 'company', type: 'text', label: 'Company' }
          ] 
        },
        { 
          key: 'sessions', 
          label: 'Agenda', 
          singularLabel: 'Session',
          icon: 'clock',
          fields: [
            { name: 'title', type: 'text', label: 'Session Title' },
            { name: 'time', type: 'datetime', label: 'Start Time' },
            { name: 'speaker', type: 'text', label: 'Assigned Speaker' }
          ] 
        },
        {
          key: 'tickets',
          label: 'Registrations',
          singularLabel: 'Ticket',
          icon: 'ticket',
          fields: [
            { name: 'attendee', type: 'text', label: 'Attendee Name' },
            { name: 'type', type: 'select', label: 'Ticket Type' } // e.g., VIP, General
          ]
        }
      ]
    };
  } else if (lowerPrompt.includes('mechanic')) {
    config = {
      themeColor: 'slate',
      resources: [
        { 
          key: 'mechanics', 
          label: 'Mechanics', 
          singularLabel: 'Mechanic',
          icon: 'wrench',
          fields: [{ name: 'specialty', type: 'text', label: 'Specialty' }] 
        },
        { 
          key: 'service-slots', 
          label: 'Service Bay', 
          singularLabel: 'Service Slot',
          icon: 'car',
          fields: [{ name: 'vehicle', type: 'text', label: 'Car Model' }]
        }
      ]
    };
  }

  // Create the Tenant in DB
  const newOrg = await Organization.create({
    name: prompt, // Simplified
    slug: prompt.replace(/\s+/g, '-').toLowerCase(),
    config: config
  });

  return NextResponse.json(newOrg);
}