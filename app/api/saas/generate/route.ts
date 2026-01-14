import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai'; // <--- Switched to Google
import Organization from '@/models/Organization';
import GenericResource from '@/models/GenericResource'; 
import dbConnect from '@/lib/dbConnect';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    await dbConnect(); 
    const { name, prompt } = await req.json();

    // 1. Generate Slug
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    // 2. Configure the Model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview", // Fast and efficient
      generationConfig: {
        responseMimeType: "application/json" // Enforce JSON output
      }
    });

    // 3. The Prompt (Gemini needs a clear schema definition)
    const systemPrompt = `
      You are a SaaS Architecture Engine. You receive a business description and generate a database schema and initial data for it.
      
      You must output a JSON object with this exact structure:
      {
        "businessType": "string (e.g. 'Fitness Center')",
        "themeColor": "string (one of: 'blue', 'indigo', 'emerald', 'slate', 'violet', 'orange')",
        "resources": [
          {
            "key": "string (e.g. 'trainers' - lowercase, plural, no spaces)",
            "label": "string (e.g. 'Trainers')",
            "singularLabel": "string (e.g. 'Trainer')",
            "icon": "string (Lucide icon name, e.g. 'users', 'calendar', 'wrench', 'briefcase', 'ticket')",
            "fields": [
              { "name": "string (camelCase)", "label": "string (Title Case)", "type": "string (one of: 'text', 'date', 'datetime', 'select', 'number')" }
            ],
            "initialData": [
              { ...key-value pairs matching the fields above... }
            ]
          }
        ]
      }
      
      Rules:
      - Create exactly 3 distinct resources relevant to the business.
      - For each resource, generate 2 realistic items of "initialData".
      - Ensure fields are simple and useful (3-4 fields per resource).
    `;

    const userMessage = `Create a SaaS configuration for: ${prompt}. The business name is "${name}".`;

    // 4. Generate Content
    const result = await model.generateContent([systemPrompt, userMessage]);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON result from Gemini
    const aiResponse = JSON.parse(text);

    // 5. Construct Config
    const config = {
      themeColor: aiResponse.themeColor,
      resources: aiResponse.resources.map((res: any) => ({
        key: res.key,
        label: res.label,
        singularLabel: res.singularLabel,
        icon: res.icon,
        fields: res.fields
      }))
    };

    // 6. Create Organization
    const newOrg = await Organization.create({
      name: name,
      slug: generatedSlug,
      businessType: aiResponse.businessType,
      config: config
    });

    // 7. Seed Data
    const seedPromises = aiResponse.resources.flatMap((res: any) => {
      return res.initialData.map((item: any) => {
        return GenericResource.create({
          organizationId: newOrg._id,
          resourceType: res.key,
          data: item
        });
      });
    });

    await Promise.all(seedPromises);

    return NextResponse.json(newOrg.toObject());

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate SaaS" },
      { status: 500 }
    );
  }
}