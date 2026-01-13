import { NextResponse } from 'next/server';
import Organization from '@/models/Organization';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const lowerPrompt = prompt.toLowerCase();

  let config = {};

  // LOGIC: Decide the structure based on keywords
  if (lowerPrompt.includes('gym')) {
    config = {
      themeColor: 'emerald',
      resources: [
        { 
          key: 'trainers', 
          label: 'Trainers', 
          icon: 'users',
          fields: [{ name: 'bio', type: 'text', label: 'Biography' }] 
        },
        { 
          key: 'classes', 
          label: 'Classes', 
          icon: 'calendar',
          fields: [{ name: 'time', type: 'date', label: 'Start Time' }] 
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
          icon: 'wrench',
          fields: [{ name: 'specialty', type: 'text', label: 'Specialty' }] 
        },
        { 
          key: 'service-slots', 
          label: 'Service Bay', 
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