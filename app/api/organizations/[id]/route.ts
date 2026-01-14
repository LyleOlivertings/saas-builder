import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Organization from '@/models/Organization';

// GET: Fetch single client
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Next.js 15 Promise type
) {
  await dbConnect();
  const { id } = await params;
  
  const org = await Organization.findById(id);
  
  if (!org) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
  }

  return NextResponse.json(org);
}

// PUT: Update client
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    // Allows updating Name, Slug, AND the Config object
    const updatedOrg = await Organization.findByIdAndUpdate(
      id,
      {
        $set: {
          name: body.name,
          slug: body.slug,
          config: body.config, 
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedOrg) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    return NextResponse.json(updatedOrg);
  } catch (error) {
    console.error('Update failed:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}