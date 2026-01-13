export default async function DynamicResourcePage({ params }) {
  const { slug, resource } = params;

  // 1. Fetch Organization Config
  const org = await Organization.findOne({ slug });
  
  // 2. Find the specific definition for this resource (e.g., Mechanics)
  const resourceDef = org.config.resources.find(r => r.key === resource);

  // 3. Fetch the actual data (You need a GenericDataModel for this)
  // const data = await GenericData.find({ orgId: org._id, type: resource });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{resourceDef.label}</h1>
      
      {/* A Generic Table that takes columns from the config */}
      <DataTable 
        columns={resourceDef.fields} 
        data={[]} // Pass fetched data here
      />
    </div>
  );
}