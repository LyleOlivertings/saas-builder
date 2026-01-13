'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  Zap, 
  Globe, 
  Wrench 
} from 'lucide-react';

export default function CreateClientPage() {
  const [prompt, setPrompt] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const router = useRouter();

  // Quick prompts for your Friday Demo
  const suggestions = [
    { 
      label: 'Global Tech Summit', 
      icon: Globe, 
      text: 'A large international technology summit 2026 with speakers, agenda, and tickets.',
      color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    { 
      label: 'Auto Mechanic Shop', 
      icon: Wrench, 
      text: 'A busy diesel mechanic shop in Cape Town managing mechanics and service bays.',
      color: 'bg-slate-500/20 text-slate-300 border-slate-500/30'
    }
  ];

  const handleBuild = async () => {
    if (!prompt) return;
    setIsBuilding(true);

    try {
      // 1. Call the "AI" API
      const res = await fetch('/api/saas/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error('Failed to build');

      const newOrg = await res.json();

      // 2. Artificial delay for "Theatrics" (Show off the loader)
      await new Promise(r => setTimeout(r, 1500));

      // 3. Redirect to the new Dashboard
      router.push(`/${newOrg.slug}/dashboard/speakers`); // Default to speakers for the event demo
    } catch (error) {
      console.error(error);
      setIsBuilding(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      
      {/* --- Background Effects --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>

      <div className="z-10 w-full max-w-2xl px-6">
        
        {/* --- Header Section --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 shadow-2xl backdrop-blur-xl">
            <Sparkles className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-4">
            What are we building?
          </h1>
          <p className="text-lg text-gray-400 max-w-lg mx-auto leading-relaxed">
            Describe the business case, and our engine will construct the backend, database, and dashboard instantly.
          </p>
        </motion.div>

        {/* --- Input Card --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-30 blur transition duration-500 group-hover:opacity-60" />
          
          <div className="relative rounded-2xl bg-gray-900/90 border border-white/10 backdrop-blur-xl p-2 shadow-2xl">
            <div className="relative flex items-center">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isBuilding}
                placeholder="e.g. A 3-day Design Conference with workshops..."
                className="w-full bg-transparent border-none text-lg px-6 py-5 text-white placeholder-gray-500 focus:outline-none focus:ring-0 disabled:opacity-50"
                onKeyDown={(e) => e.key === 'Enter' && handleBuild()}
              />
              <button
                onClick={handleBuild}
                disabled={!prompt || isBuilding}
                className="absolute right-2 mr-1 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {isBuilding ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ArrowRight className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* --- Suggestions (Quick Start for Demo) --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 flex items-center gap-2">
            <Zap className="h-3 w-3" /> Quick Start Presets
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(item.text)}
                disabled={isBuilding}
                className={`group flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] text-left ${item.color} border border-transparent hover:border-white/10 bg-opacity-10 hover:bg-opacity-20`}
              >
                <div className={`mt-1 rounded-lg p-2 bg-black/20 group-hover:bg-black/40 transition-colors`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{item.label}</h3>
                  <p className="text-xs opacity-70 leading-relaxed">{item.text}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* --- Loading Status Text --- */}
        <AnimatePresence>
          {isBuilding && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Configuring database schema & generating resources...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}