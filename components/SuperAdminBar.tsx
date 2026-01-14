'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  LayoutGrid, 
  Edit, 
  Eye, 
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SuperAdminBarProps {
  clientId: string;
  clientName: string;
}

export default function SuperAdminBar({ clientId, clientName }: SuperAdminBarProps) {
  // Demo Admin Flag check
  const isAdminEnvironment = process.env.NEXT_PUBLIC_DEMO_ADMIN_MODE === 'true';
  
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  if (!isAdminEnvironment) return null;

  return (
    <>
      {/* --- 1. THE MAIN BAR (Now with Layout Animation) --- */}
      <AnimatePresence initial={false}>
        {!isPreviewMode && (
          <motion.div 
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ 
              height: 48, // Matches h-12 (12 * 4px = 48px)
              opacity: 1, 
              y: 0,
              transition: { type: "spring", stiffness: 300, damping: 30 }
            }}
            exit={{ 
              height: 0, 
              opacity: 0, 
              y: -20,
              transition: { duration: 0.3, ease: "easeInOut" } // Smooth exit
            }}
            className="bg-[#050505] border-b border-white/10 flex items-center justify-between px-4 text-xs font-medium text-white z-[100] relative overflow-hidden"
          >
            {/* CONTENT WRAPPER (Prevents squishing during shrink) */}
            <div className="flex w-full items-center justify-between h-12">
              
              {/* Left: Global Nav */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-blue-500">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="uppercase tracking-wider font-bold">Nexus Admin</span>
                </div>
                
                <div className="h-4 w-px bg-white/10" />

                <Link 
                  href="/saas-admin/dashboard" 
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <LayoutGrid className="h-3 w-3" />
                  All Clients
                </Link>
              </div>

              {/* Center: Context Badge */}
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-gray-500">
                <span className="hidden md:inline">Viewing Session:</span>
                <span className="text-gray-300 bg-white/5 px-2 py-0.5 rounded border border-white/10 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"/>
                  {clientName}
                </span>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3">
                <Link 
                  href={`/saas-admin/clients/${clientId}`}
                  className="flex items-center gap-2 hover:bg-white/10 text-gray-300 px-3 py-1.5 rounded transition-all"
                >
                  <Edit className="h-3 w-3" />
                  <span className="hidden md:inline">Config</span>
                </Link>

                {/* THE TOGGLE BUTTON */}
                <button 
                  onClick={() => setIsPreviewMode(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                  title="Switch to Client View"
                >
                  <Eye className="h-3 w-3" />
                  <span className="hidden md:inline">Client View</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 2. THE FLOATING RESTORE BUTTON --- */}
      <AnimatePresence>
        {isPreviewMode && (
          <motion.button
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              transition: { delay: 0.3, type: "spring" } // Wait for bar to close first
            }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            onClick={() => setIsPreviewMode(false)}
            className="fixed bottom-6 right-6 z-[100] bg-zinc-900 border border-white/10 text-white p-3 rounded-full shadow-2xl hover:bg-zinc-800 transition-colors group"
            title="Restore Admin Bar"
          >
            <ShieldCheck className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
            
            {/* Tooltip */}
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none">
              Restore Admin View
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}