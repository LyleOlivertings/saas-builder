export default async function DashboardLayout({ params, children }) {
  // 1. Fetch the Config
  const org = await Organization.findOne({ slug: params.slug });
  const { resources, themeColor } = org.config;

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className={`w-64 bg-${themeColor}-900 text-white`}>
        <div className="p-6 font-bold text-xl">{org.name}</div>
        <nav>
          {resources.map((res) => (
            <Link 
              key={res.key} 
              href={`/${params.slug}/dashboard/${res.key}`}
              className="block px-6 py-2 hover:bg-white/10"
            >
              {/* Dynamic Icon & Label */}
              <Icon name={res.icon} /> {res.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}