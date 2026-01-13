import { notFound } from 'next/navigation';
import Organization from '@/models/Organization';
import DashboardShell from '@/components/DashboardShell';
import dbConnect from '@/lib/dbConnect'; // Ensure you have a dbConnect utility or use your mongoose pattern

export default async function DashboardLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode; 
  params: { slug: string };
}) {
  // 1. Connect to DB (Critical step in Server Components)
  // Note: Adjust the import path if your dbConnect is in a different utils folder
  if (typeof dbConnect === 'function') await dbConnect(); 
  
  // 2. Fetch the Organization Configuration
  // We use .lean() if available to strip Mongoose extras, or just standard findOne
  const organization = await Organization.findOne({ slug: params.slug }).lean();

  if (!organization) {
    return notFound();
  }

  // 3. Serialize Data
  // Server Components cannot pass complex Mongoose objects (like ObjectIds) directly to Client Components.
  // We sanitize it simply:
  const serializedOrg = JSON.parse(JSON.stringify(organization));

  return (
    <DashboardShell organization={serializedOrg}>
      {children}
    </DashboardShell>
  );
}