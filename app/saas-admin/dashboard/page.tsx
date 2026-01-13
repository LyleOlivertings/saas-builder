import Link from "next/link";
import { ArrowUpRight, Users, Server, Activity, Plus } from "lucide-react";
import Organization from "@/models/Organization";
import dbConnect from "@/lib/dbConnect";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic"; // Ensure we always see fresh data

async function getStats() {
  await dbConnect();

  // 1. Fetch all clients sorted by newest
  const clients = await Organization.find({}).sort({ createdAt: -1 });

  // 2. Calculate summary data
  const totalClients = clients.length;
  const activeClients = clients.filter(
    (c: any) => c.status === "active"
  ).length;

  return { clients, totalClients, activeClients };
}

export default async function AdminDashboard() {
  const { clients, totalClients, activeClients } = await getStats();

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Platform Overview
          </h1>
          <p className="text-gray-400">
            Manage your deployed client instances and monitor performance.
          </p>
        </div>
        <Link href="/saas-admin/create">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all active:scale-95">
            <Plus className="h-4 w-4" /> Deploy New Client
          </button>
        </Link>
      </div>

      {/* --- STAT CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Clients"
          value={totalClients}
          icon={Users}
          trend="+12% this month"
          color="blue"
        />
        <StatCard
          label="Active Deployments"
          value={activeClients}
          icon={Server}
          trend="100% uptime"
          color="emerald"
        />
        <StatCard
          label="System Health"
          value="98.2%"
          icon={Activity}
          trend="Normal load"
          color="indigo"
        />
      </div>

      {/* --- CLIENT GRID --- */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6">
          Recent Deployments
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {clients.map((client: any) => (
            <ClientCard key={client._id} client={client} />
          ))}

          {/* Empty State / Add New Card */}
          <Link
            href="/saas-admin/create"
            className="group relative flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all min-h-[200px]"
          >
            <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <span className="text-gray-500 font-medium">Create New Client</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ label, value, icon: Icon, trend, color }: any) {
  const colors: any = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  };

  return (
    <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <span className="text-xs font-medium text-gray-500 bg-white/5 px-2 py-1 rounded-full">
          {trend}
        </span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

function ClientCard({ client }: any) {
  // Theme color mapping for visual flair
  const theme = client.config?.themeColor || "blue";

  return (
    <div className="group relative p-6 rounded-2xl bg-[#0f0f0f] border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1">
      <div className="flex justify-between items-start mb-6">
        <div
          className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl font-bold bg-${theme}-900/20 text-${theme}-400 border border-${theme}-500/20`}
        >
          {client.name.charAt(0)}
        </div>
        <div className="px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Active
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 truncate">
        {client.name}
      </h3>
      <p className="text-sm text-gray-500 mb-6 truncate">
        {client.businessType || "Custom SaaS Application"}
      </p>

      <div className="flex items-center justify-between pt-6 border-t border-white/5">
        <span className="text-xs text-gray-600">
          Deployed{" "}
          {client.createdAt
            ? formatDistanceToNow(new Date(client.createdAt))
            : "recently"}{" "}
          ago
        </span>

        <Link
          href={`/${client.slug}/dashboard/speakers`} // Defaulting to first resource
          className="flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          Manage <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
