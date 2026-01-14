'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Code, Trash2, Settings } from 'lucide-react';
import Link from 'next/link';

export default function EditClientPage() {
  const params = useParams(); // { id: string }
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [configString, setConfigString] = useState(''); // Store JSON as string

  useEffect(() => {
    async function fetchClient() {
      if (!params.id) return;
      try {
        const res = await fetch(`/api/organizations/${params.id}`);
        const data = await res.json();
        
        setName(data.name);
        setSlug(data.slug);
        setConfigString(JSON.stringify(data.config, null, 2)); // Pretty print JSON
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchClient();
  }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Validate JSON
      let configObj;
      try {
        configObj = JSON.parse(configString);
      } catch (e) {
        alert("Invalid JSON format. Please check your syntax.");
        setSaving(false);
        return;
      }

      // 2. Send Update
      const res = await fetch(`/api/organizations/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          config: configObj
        })
      });

      if (!res.ok) throw new Error('Failed to update');

      alert('Configuration saved successfully!');
    } catch (e) {
      alert('Error saving client.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/saas-admin/dashboard">
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-400" />
              </button>
            </Link>
            <div>
               <h1 className="text-2xl font-bold">Edit Client</h1>
               <p className="text-gray-400 text-sm">ID: {params.id}</p>
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Metadata */}
          <div className="space-y-6">
            <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-gray-300 flex items-center gap-2">
                <Settings className="h-4 w-4" /> General Settings
              </h3>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Business Name</label>
                <input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Slug (Subdomain)</label>
                <input 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6">
              <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                <Code className="h-4 w-4" /> Developer Mode
              </h4>
              <p className="text-xs text-blue-300/70 leading-relaxed">
                You are editing the raw configuration. This controls the navigation, data fields, and theme. 
                <br/><br/>
                <strong>Tip:</strong> You can add new fields to "resources" here and they will instantly appear on the dashboard.
              </p>
            </div>
          </div>

          {/* Right Column: JSON Editor */}
          <div className="lg:col-span-2">
            <div className="bg-[#0f0f0f] border border-white/10 rounded-xl overflow-hidden flex flex-col h-[600px] shadow-2xl">
              <div className="bg-white/5 border-b border-white/5 px-4 py-3 flex justify-between items-center">
                <span className="text-xs font-mono text-gray-400">config.json</span>
                <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20">Active Configuration</span>
              </div>
              <textarea
                value={configString}
                onChange={(e) => setConfigString(e.target.value)}
                className="flex-1 w-full bg-[#0a0a0a] p-6 font-mono text-sm text-green-400 focus:outline-none resize-none leading-relaxed"
                spellCheck="false"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}