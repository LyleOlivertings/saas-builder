import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Organization from '@/models/Organization';

export async function GET() {
  await dbConnect();
  // Fetch all, sort by newest
  const orgs = await Organization.find({}).sort({ createdAt: -1 });
  return NextResponse.json(orgs);
}