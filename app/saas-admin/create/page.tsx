'use client';
// ... imports

export default function CreateClient() {
  const [prompt, setPrompt] = useState('');

  const generateSaaS = async () => {
    // 1. Send prompt to your API
    const res = await fetch('/api/saas/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt }) 
    });
    
    // 2. The API returns the configured Organization
    const newOrg = await res.json();
    
    // 3. Redirect to their new dashboard
    router.push(`/${newOrg.slug}/dashboard`);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold">SaaS Generator</h1>
      <input 
        className="mt-8 w-96 rounded-lg bg-gray-800 p-4 text-white"
        placeholder="e.g. A dentist office managing patients..."
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={generateSaaS} className="mt-4 bg-blue-600 px-6 py-2 rounded">
        Build Dashboard
      </button>
    </div>
  );
}