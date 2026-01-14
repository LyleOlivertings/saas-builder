'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react'; 
import { 
  Menu, 
  X, 
  LogOut, 
  ChevronRight, 
  Bell, 
  Search 
} from 'lucide-react';

// A safe way to render dynamic icons from strings
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const iconName = name.charAt(0).toUpperCase() + name.slice(1);
  const IconComponent = (Icons as any)[iconName] || Icons.Box;
  return <IconComponent className={className} />;
};

export default function DashboardShell({ 
  children, 
  organization 
}: { 
  children: React.ReactNode; 
  organization: any; 
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { config, slug, name } = organization;

  // Map theme colors to actual Tailwind classes
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
    slate: 'bg-slate-500/10 text-slate-300 border-slate-500/20 hover:bg-slate-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20',
  };

  const activeThemeClass = colorMap[config.themeColor] || colorMap['blue'];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex overflow-hidden">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex w-72 flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl h-screen sticky top-0 z-40">
        
        {/* Logo Area */}
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${activeThemeClass}`}>
              <span className="text-lg font-bold">{name.charAt(0)}</span>
            </div>
            <span className="font-bold tracking-wide truncate">{name}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
          {config.resources.map((res: any) => {
            const href = `/${slug}/dashboard/${res.key}`;
            const isActive = pathname.includes(res.key);

            return (
              <Link key={res.key} href={href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? `${activeThemeClass} border font-medium shadow-[0_0_15px_rgba(0,0,0,0.3)]` 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <DynamicIcon name={res.icon} className={`h-5 w-5 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} />
                  <span>{res.label}</span>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="absolute right-4 h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor]"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* User / Footer */}
        <div className="p-4 border-t border-white/5">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors">
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
          
          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-white/5"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Breadcrumb / Title */}
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
             <span>Dashboard</span>
             <ChevronRight className="h-4 w-4" />
             <span className="text-white capitalize">
               {pathname.split('/').pop()}
             </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
             <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input 
                  placeholder="Quick search..." 
                  className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all w-64"
                />
             </div>
             <button className="p-2 relative rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
               <Bell className="h-5 w-5" />
               <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-black" />
             </button>
             <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 ring-2 ring-white/10" />
          </div>
        </header>

        {/* Page Content with Entry Animation */}
        <main className="flex-1 overflow-auto bg-[#0a0a0a] relative">
          
          {/* Background Gradient Blob */}
          <div className={`absolute top-0 left-0 w-[500px] h-[500px] bg-${config.themeColor}-500/10 rounded-full blur-[100px] -z-10 pointer-events-none`} />
          
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            // 🔴 CHANGED HERE: Removed "max-w-7xl mx-auto" and added "w-full h-full"
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* --- MOBILE DRAWER (AnimatePresence) --- */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-[#0f0f0f] border-r border-white/10 z-50 md:hidden flex flex-col shadow-2xl"
            >
               <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
                 <span className="font-bold text-lg">{name}</span>
                 <button onClick={() => setIsMobileOpen(false)}><X className="h-6 w-6 text-gray-400" /></button>
               </div>
               <nav className="flex-1 p-4 space-y-2">
                 {config.resources.map((res: any) => (
                    <Link key={res.key} href={`/${slug}/dashboard/${res.key}`} onClick={() => setIsMobileOpen(false)}>
                      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${pathname.includes(res.key) ? activeThemeClass : 'text-gray-400'}`}>
                         <DynamicIcon name={res.icon} className="h-5 w-5" />
                         <span>{res.label}</span>
                      </div>
                    </Link>
                 ))}
               </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}