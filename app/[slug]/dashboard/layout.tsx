import { notFound } from 'next/navigation';
import Organization from '@/models/Organization';
import DashboardShell from '@/components/DashboardShell';
import dbConnect from '@/lib/dbConnect';

export default async function DashboardLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode; 
  params: Promise<{ slug: string }>; // <--- 1. Change Type to Promise
}) {
  await dbConnect(); 
  
  // 2. Await the params before using them
  const { slug } = await params;

  // 3. Use the unwrapped slug
  const organization = await Organization.findOne({ slug }).lean();

  if (!organization) {
    return notFound();
  }

  const serializedOrg = JSON.parse(JSON.stringify(organization));

  return (
    <DashboardShell organization={serializedOrg}>
      {children}
    </DashboardShell>
  );
}