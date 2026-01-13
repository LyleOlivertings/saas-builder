'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function EditClientPage() {
  const params = useParams(); // Client-side param access
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    configString: '' // We store the JSON config as a string for editing
  });

  // 1. Fetch Client Data
  useEffect(() => {
    async function fetchClient() {
      if (!params.id) return;
      const res = await fetch(`/api/organizations/${params.id}`);
      const data = await res.json();
      
      setFormData({
        name: data.name,
        slug: data.slug,
        // Pretty print the JSON so it's easy to edit
        configString: JSON.stringify(data.config, null, 2)
      });
      setLoading(false);
    }
    fetchClient();
  }, [params.id]);

  // 2. Handle Save
  const handleSave = async () => {
    setSaving(true);
    try {
      // Validate JSON before sending
      const configObj = JSON.parse(formData.configString);

      const res = await fetch(`/api/organizations/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          config: configObj
        })
      });

      if (!res.ok) throw new Error('Failed to update');

      // Redirect back to main dashboard or the client's dashboard
      router.push('/saas-admin/dashboard');
    } catch (e) {
      alert('Error saving: Invalid JSON or Server Error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-white">Loading client details...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
             <h1 className="text-2xl font-bold text-white">Edit Client</h1>
             <p className="text-gray-400 text-sm">Correct generation errors or update branding.</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-8 space-y-6">
        
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Business Name</label>
            <input 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">URL Slug (Subdomain)</label>
            <input 
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* The Power Tool: JSON Config Editor */}
        <div className="space-y-2">
           <div className="flex justify-between">
             <label className="text-sm font-medium text-gray-400">Core Configuration (JSON)</label>
             <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Developer Mode</span>
           </div>
           <p className="text-xs text-gray-500 mb-2">
             Edit resources, fields, and theme colors directly here. This controls the entire dashboard structure.
           </p>
           <textarea
             value={formData.configString}
             onChange={(e) => setFormData({ ...formData, configString: e.target.value })}
             className="w-full h-96 font-mono text-sm bg-black/50 border border-white/10 rounded-lg p-4 text-green-400 focus:border-blue-500 outline-none leading-relaxed"
             spellCheck="false"
           />
        </div>

      </div>

      {/* Danger Zone */}
      <div className="border border-red-900/30 bg-red-900/5 rounded-xl p-6 flex justify-between items-center">
         <div>
           <h3 className="text-red-400 font-medium">Delete Organization</h3>
           <p className="text-red-400/60 text-sm">This action cannot be undone.</p>
         </div>
         <button className="text-red-400 hover:bg-red-900/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
           Delete Client
         </button>
      </div>

    </div>
  );
}