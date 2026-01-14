'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  ArrowUpRight, 
  Users, 
  Settings, 
  Loader2 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch('/api/organizations'); // We need to create this list endpoint
        if (res.ok) {
          const data = await res.json();
          setClients(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, []);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Platform Overview
            </h1>
            <p className="text-gray-400 mt-1">Manage your deployed client instances.</p>
          </div>
          <Link href="/saas-admin/create">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all active:scale-95">
              <Plus className="h-4 w-4" /> Deploy New Client
            </button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input 
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
          />
        </div>

        {/* Client Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-blue-500" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => {
              // LOGIC: Find the first resource to link to (e.g. 'speakers')
              const firstResource = client.config?.resources?.[0]?.key || 'settings';
              const manageLink = `/${client.slug}/dashboard/`;

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={client._id}
                  className="group relative bg-[#0f0f0f] border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl font-bold bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 text-white`}>
                      {client.name.charAt(0)}
                    </div>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/saas-admin/clients/${client._id}`}>
                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white" title="Edit Config">
                          <Settings className="h-4 w-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-1 truncate">{client.name}</h3>
                  <p className="text-sm text-gray-500 mb-6 font-mono truncate">
                    {client.slug}.nexus-saas.com
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Users className="h-3 w-3" />
                      <span>{client.config?.resources?.length || 0} Resources</span>
                    </div>
                    
                    <Link 
                      href={manageLink}
                      className="flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Manage <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}