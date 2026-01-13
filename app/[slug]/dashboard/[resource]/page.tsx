import Organization from '@/models/Organization';
import GenericResource from '@/models/GenericResource';
import DataTable from '@/components/DataTable'; // <--- Import the new component

export default async function DynamicResourcePage({ params }: { params: { slug: string, resource: string } }) {
  const { slug, resource } = params;

  // 1. Fetch Config
  const org = await Organization.findOne({ slug });
  if (!org) return <div>Not Found</div>;
  
  const resourceDef = org.config.resources.find((r: any) => r.key === resource);
  
  // 2. Fetch Data
  const docs = await GenericResource.find({ 
    organizationId: org._id, 
    resourceType: resource 
  }).sort({ createdAt: -1 });

  // 3. Format Data for Table
  // We attach the Mongo _id as 'id' for the table actions
  const tableData = docs.map(doc => ({ 
    id: doc._id.toString(), 
    ...doc.data 
  }));

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {resourceDef.label}
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your {resourceDef.singularLabel.toLowerCase()}s here.
          </p>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all active:scale-95">
          + Add {resourceDef.singularLabel}
        </button>
      </div>
      
      {/* The Modern Table */}
      <DataTable 
        columns={resourceDef.fields} 
        data={tableData} 
      />
    </div>
  );
}