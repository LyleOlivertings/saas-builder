import Link from 'next/link';
import { ShieldCheck, Plus, LayoutGrid, Settings } from 'lucide-react';

export default function SaaSAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* --- MASTER SIDEBAR --- */}
      <aside className="w-20 lg:w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl flex flex-col sticky top-0 h-screen">
        
        {/* Logo */}
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <span className="hidden lg:block ml-3 font-bold text-lg tracking-tight">AnyNet SA</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-8 flex flex-col gap-2 px-3">
          <Link href="/saas-admin/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 text-blue-400 border border-blue-500/20 transition-all hover:bg-white/10">
            <LayoutGrid className="h-5 w-5" />
            <span className="hidden lg:block font-medium">Overview</span>
          </Link>

          <Link href="/saas-admin/create" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <Plus className="h-5 w-5" />
            <span className="hidden lg:block font-medium">New Client</span>
          </Link>
          
          <div className="mt-auto">
             <Link href="#" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all">
              <Settings className="h-5 w-5" />
              <span className="hidden lg:block font-medium">Platform Settings</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* --- CONTENT AREA --- */}
      <main className="flex-1 overflow-auto">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050505]/50 backdrop-blur-sm sticky top-0 z-10">
          <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Master Control View</h2>
          <div className="h-8 w-8 rounded-full bg-gray-800 border border-white/10" />
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}