'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Filter, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { format } from 'date-fns'; // Optional: for nice date formatting

interface Column {
  name: string;
  label: string;
  type: string; // 'text', 'date', 'select', etc.
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function DataTable({ columns, data, onEdit, onDelete }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 1. Client-side Search Logic
  const filteredData = data.filter((row) =>
    columns.some((col) =>
      String(row[col.name] || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  // 2. Client-side Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 3. Render Helper for dynamic cell types
  const renderCell = (item: any, col: Column) => {
    const value = item[col.name];

    if (!value) return <span className="text-gray-500 italic">--</span>;

    if (col.type === 'date' || col.type === 'datetime') {
      return (
        <span className="font-mono text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
          {new Date(value).toLocaleDateString()}
        </span>
      );
    }
    
    if (col.type === 'select' || col.name === 'status') {
       // Auto-badge for status fields
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800">
          {value}
        </span>
      );
    }

    // Default Text
    return <span className="text-gray-300 font-medium">{value}</span>;
  };

  return (
    <div className="w-full space-y-4">
      
      {/* --- Toolbar --- */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 p-1">
        <div className="relative group w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-600"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-all">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* --- Table Container --- */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/30 backdrop-blur-sm overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm">
          {/* Header */}
          <thead className="bg-gray-900/80 border-b border-gray-800">
            <tr>
              {columns.map((col) => (
                <th key={col.name} className="px-6 py-4 font-semibold text-gray-400 uppercase tracking-wider text-xs">
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-800/50">
            <AnimatePresence mode="wait">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <motion.tr
                    key={row.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="group hover:bg-white/[0.03] transition-colors"
                  >
                    {columns.map((col) => (
                      <td key={`${row.id}-${col.name}`} className="px-6 py-4 whitespace-nowrap">
                        {renderCell(row, col)}
                      </td>
                    ))}
                    
                    {/* Actions Column */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={() => onEdit?.(row.id)}
                           className="p-1.5 rounded-md hover:bg-blue-500/20 text-gray-500 hover:text-blue-400 transition-colors"
                         >
                           <Edit2 className="h-4 w-4" />
                         </button>
                         <button 
                           onClick={() => onDelete?.(row.id)}
                           className="p-1.5 rounded-md hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors"
                         >
                           <Trash2 className="h-4 w-4" />
                         </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <Search className="h-8 w-8 opacity-20" />
                       <p>No records found matching "{searchTerm}"</p>
                    </div>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* --- Pagination Footer --- */}
      <div className="flex items-center justify-between px-2">
         <span className="text-xs text-gray-500">
           Showing {paginatedData.length} of {filteredData.length} entries
         </span>
         <div className="flex gap-1">
           <button
             onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
             disabled={currentPage === 1}
             className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
           >
             <ChevronLeft className="h-4 w-4" />
           </button>
           <button
             onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
             disabled={currentPage === totalPages}
             className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
           >
             <ChevronRight className="h-4 w-4" />
           </button>
         </div>
      </div>
    </div>
  );
}