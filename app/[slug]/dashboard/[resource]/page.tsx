'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface FieldDef {
  name: string;
  label: string;
  type: string;
}

interface ResourcePageProps {
  params: Promise<{ slug: string; resource: string }>;
}

export default function DynamicResourcePage({ params }: ResourcePageProps) {
  const router = useRouter();
  
  // State for data and config
  const [slug, setSlug] = useState<string>('');
  const [resourceKey, setResourceKey] = useState<string>('');
  const [resourceLabel, setResourceLabel] = useState<string>('');
  const [fields, setFields] = useState<FieldDef[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State for "Add New" Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newItem, setNewItem] = useState<Record<string, string>>({});

  // 1. Fetch Data on Mount (Client-side fetch ensures fresh data after updates)
  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      try {
        const unwrappedParams = await params;
        if (!isMounted) return;
        
        setSlug(unwrappedParams.slug);
        setResourceKey(unwrappedParams.resource);

        // Fetch both Config and Data in one custom API endpoint for efficiency
        // OR fetch them separately. Let's assume we fetch from our generic API.
        const res = await fetch(`/api/${unwrappedParams.slug}/${unwrappedParams.resource}`);
        if (!res.ok) throw new Error('Failed to load resource');
        
        const json = await res.json();
        
        setResourceLabel(json.config.label);
        setFields(json.config.fields);
        setData(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();
    return () => { isMounted = false; };
  }, [params]);

  // 2. Handle Create
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/${slug}/${resourceKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (!res.ok) throw new Error('Failed to create');

      const createdDoc = await res.json();
      
      // Optimistic Update
      setData((prev) => [createdDoc, ...prev]);
      setIsAddOpen(false);
      setNewItem({});
    } catch (error) {
      alert('Error creating item');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`/api/${slug}/${resourceKey}?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');

      // Optimistic Update
      setData((prev) => prev.filter((item) => item.id !== id && item._id !== id));
    } catch (error) {
      alert('Error deleting item');
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-white/50">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {resourceLabel}
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your {resourceLabel?.toLowerCase()} here.
          </p>
        </div>
        
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add New
        </button>
      </div>

      {/* Modern Table */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-black/20 text-gray-200 font-medium uppercase text-xs tracking-wider">
            <tr>
              {fields.map((f) => (
                <th key={f.name} className="px-6 py-4">{f.label}</th>
              ))}
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
             {data.length === 0 ? (
               <tr>
                 <td colSpan={fields.length + 1} className="px-6 py-12 text-center text-gray-500">
                   No records found. Click "Add New" to create one.
                 </td>
               </tr>
             ) : (
               data.map((row) => (
                 <tr key={row.id || row._id} className="hover:bg-white/5 transition-colors">
                   {fields.map((f) => (
                     <td key={f.name} className="px-6 py-4 text-white">
                       {row[f.name]}
                     </td>
                   ))}
                   <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(row.id || row._id)}
                        className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors text-gray-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                   </td>
                 </tr>
               ))
             )}
          </tbody>
        </table>
      </div>

      {/* --- ADD MODAL (Dialog) --- */}
      <AnimatePresence>
        {isAddOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-2xl z-50"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Add {resourceLabel}</h2>
                <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                {fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">{field.label}</label>
                    
                    {field.type === 'select' ? (
                       <select
                         required
                         className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                         onChange={(e) => setNewItem({...newItem, [field.name]: e.target.value})}
                       >
                         <option value="">Select an option...</option>
                         <option value="Standard">Standard</option>
                         <option value="VIP">VIP</option>
                       </select>
                    ) : field.type === 'date' || field.type === 'datetime' ? (
                      <input 
                        type="datetime-local"
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                        onChange={(e) => setNewItem({...newItem, [field.name]: e.target.value})}
                      />
                    ) : (
                      <input 
                        type="text"
                        required
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                        onChange={(e) => setNewItem({...newItem, [field.name]: e.target.value})}
                      />
                    )}
                  </div>
                ))}

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsAddOpen(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-medium transition-colors flex justify-center items-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Item'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}