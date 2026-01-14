import Link from 'next/link';
import { 
  ArrowUpRight, 
  Activity, 
  Clock, 
  Database
} from 'lucide-react';
import Organization from '@/models/Organization';
import GenericResource from '@/models/GenericResource';
import dbConnect from '@/lib/dbConnect';
import * as Icons from 'lucide-react';

export default async function ClientDashboardPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  await dbConnect();
  const { slug } = await params;

  const org = await Organization.findOne({ slug }).lean();
  if (!org) return <div>Not found</div>;

  const statsPromises = org.config.resources.map(async (res: any) => {
    const count = await GenericResource.countDocuments({
      organizationId: org._id,
      resourceType: res.key
    });
    return {
      label: res.label,
      value: count,
      icon: res.icon,
      key: res.key,
      color: org.config.themeColor || 'blue'
    };
  });

  const stats = await Promise.all(statsPromises);

  return (
    // 1. Force Full Width & Height with 'w-full h-full'
    // 2. Add 'max-w-[1920px]' to prevent it looking weird on 4k screens, but filling 1080p/1440p
    <div className="w-full min-h-full px-6 lg:px-10 py-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400">
          Welcome back to the {org.name} command center.
        </p>
      </div>

      {/* Stats Grid - Auto expanding */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {stats.map((stat) => {
          // @ts-ignore
          const IconComponent = Icons[stat.icon.charAt(0).toUpperCase() + stat.icon.slice(1)] || Database;
          
          return (
            <div key={stat.key} className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/5 hover:border-white/10 transition-all group w-full">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400 group-hover:bg-${stat.color}-500/20 transition-colors`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                  Live
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          );
        })}

        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/5 w-full">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                <Activity className="h-6 w-6" />
              </div>
           </div>
           <div className="text-3xl font-bold text-white mb-1">99.9%</div>
           <div className="text-sm text-gray-400">System Uptime</div>
        </div>
      </div>

      {/* --- THE FIX: 12-COLUMN FLUID GRID --- 
         On LG screens: Content is 8 cols (66%), Activity is 4 cols (33%)
         On XL screens: Content is 9 cols (75%), Activity is 3 cols (25%)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        
        {/* Left: Quick Actions (Takes up majority of space) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          <h3 className="text-lg font-bold text-white">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
             {org.config.resources.map((res: any) => (
               <Link 
                 key={res.key} 
                 href={`/${slug}/dashboard/${res.key}`}
                 className="flex items-center gap-4 p-4 rounded-xl bg-[#0f0f0f] border border-white/5 hover:border-white/20 transition-all group w-full"
               >
                 <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-white" />
                 </div>
                 <div>
                   <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">Manage {res.label}</h4>
                   <p className="text-xs text-gray-500">View and edit records</p>
                 </div>
               </Link>
             ))}
          </div>
        </div>

        {/* Right: Activity Feed (Stays right, fixed width relative to grid) */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 h-fit sticky top-6 w-full">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" /> Recent Activity
            </h3>
            
            <div className="relative border-l border-white/10 ml-2 space-y-8">
              <div className="ml-6 relative">
                <span className="absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-black" />
                <p className="text-sm text-white">New deployment successful</p>
                <p className="text-xs text-gray-500 mt-1">Just now</p>
              </div>
              <div className="ml-6 relative">
                <span className="absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full bg-gray-600 ring-4 ring-black" />
                <p className="text-sm text-gray-300">Database schema updated</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
               <button className="w-full py-2 text-xs font-medium text-gray-500 hover:text-white transition-colors bg-white/5 rounded-lg hover:bg-white/10">
                 View System Logs
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}