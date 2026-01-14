import { notFound } from 'next/navigation';
import Organization from '@/models/Organization';
import DashboardShell from '@/components/DashboardShell';
import SuperAdminBar from '@/components/SuperAdminBar'; 
import dbConnect from '@/lib/dbConnect';

export default async function DashboardLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode; 
  params: Promise<{ slug: string }>;
}) {
  await dbConnect(); 
  const { slug } = await params;

  // 1. Fetch raw data
  const organizationRaw = await Organization.findOne({ slug }).lean();

  if (!organizationRaw) {
    return notFound();
  }

  // 2. Serialize for Client Components
  const organization = JSON.parse(JSON.stringify(organizationRaw));

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* Super Admin Bar (Top) */}
      <SuperAdminBar 
        clientId={organization._id} 
        clientName={organization.name} 
      />

      {/* Main Content Wrapper */}
      {/* 🔴 WAS: <div className="flex-1 flex overflow-hidden"> */}
      {/* 🟢 CHANGE TO: Added 'w-full' and 'relative' */}
      <div className="flex-1 w-full relative overflow-hidden flex flex-col">
        <DashboardShell organization={organization}>
          {children}
        </DashboardShell>
      </div>
    </div>
  );
}