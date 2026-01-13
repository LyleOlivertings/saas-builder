import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Organization from '@/models/Organization';
import GenericResource from '@/models/GenericResource';

// GET: Fetch Config + Data
export async function GET(
  request: Request, 
  { params }: { params: Promise<{ slug: string; resource: string }> }
) {
  await dbConnect();
  const { slug, resource } = await params;

  // 1. Find the Organization
  const org = await Organization.findOne({ slug }).lean();
  if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 });

  // 2. Find the Resource Definition (Config)
  const resourceDef = org.config.resources.find((r: any) => r.key === resource);
  if (!resourceDef) return NextResponse.json({ error: 'Resource not found' }, { status: 404 });

  // 3. Find the Data
  const docs = await GenericResource.find({ 
    organizationId: org._id, 
    resourceType: resource 
  })
  .sort({ createdAt: -1 })
  .lean();

  // 4. Return Combined Payload
  return NextResponse.json({
    config: {
      label: resourceDef.label,
      fields: resourceDef.fields.map((f: any) => ({
        name: f.name,
        label: f.label,
        type: typeof f.type === 'object' ? f.type.type : f.type // Handle the Mongoose "type" quirk
      }))
    },
    data: docs.map((doc: any) => ({
      id: doc._id.toString(),
      ...doc.data
    }))
  });
}

// POST: Create New Item
export async function POST(
  request: Request, 
  { params }: { params: Promise<{ slug: string; resource: string }> }
) {
  await dbConnect();
  const { slug, resource } = await params;
  const body = await request.json();

  const org = await Organization.findOne({ slug });
  if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 });

  const newDoc = await GenericResource.create({
    organizationId: org._id,
    resourceType: resource,
    data: body
  });

  return NextResponse.json({
    id: newDoc._id.toString(),
    ...newDoc.data
  });
}

// DELETE: Remove Item
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string; resource: string }> }
) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  await GenericResource.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}