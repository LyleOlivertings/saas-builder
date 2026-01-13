import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Organization from '@/models/Organization';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Updated for Next.js 15
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const updatedOrg = await Organization.findByIdAndUpdate(
      id,
      {
        $set: {
          name: body.name,
          slug: body.slug,
          // We allow full editing of the config object (Resources, Fields, Theme)
          config: body.config, 
        },
      },
      { new: true }
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

// Also add a GET to fetch the single client for editing
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  const org = await Organization.findById(id);
  return NextResponse.json(org);
}