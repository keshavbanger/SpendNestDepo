import { useState, useMemo, useEffect } from 'react';

const getCategoryColor = (category) => {
  const colors = {
    food: 'bg-orange-50 text-orange-700 border-orange-200',
    travel: 'bg-blue-50 text-blue-700 border-blue-200',
    shopping: 'bg-pink-50 text-pink-700 border-pink-200',
    bills: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    salary: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    transfer: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    entertainment: 'bg-purple-50 text-purple-700 border-purple-200',
    healthcare: 'bg-rose-50 text-rose-700 border-rose-200',
    education: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    other: 'bg-slate-50 text-slate-700 border-slate-200'
  };
  return colors[category?.toLowerCase()] || colors.other;
};

export default function TransactionTable({ transactions }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Extract unique categories for the dropdown dynamically
  const categories = useMemo(() => {
    if (!transactions) return [];
    const cats = new Set(transactions.map(t => t.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [transactions]);

  // 1. Apply Filters & Search
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(tx => {
      const matchSearch = tx.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'all' || tx.type === filterType;
      const matchCategory = filterCategory === 'all' || tx.category === filterCategory;
      return matchSearch && matchType && matchCategory;
    });
  }, [transactions, searchTerm, filterType, filterCategory]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterCategory]);

  // 2. Apply Pagination
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / rowsPerPage));
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (!transactions || transactions.length === 0) return null;

  return (
    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-900 mb-4">All Transactions</h3>
        
        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Search description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500 shadow-sm transition-colors"
          />
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500 shadow-sm transition-colors"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500 shadow-sm transition-colors capitalize"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Table Area */}
      <div className="overflow-x-auto flex-1 min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4 text-right">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((tx, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{tx.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 truncate max-w-[200px]" title={tx.description}>
                    {tx.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${tx.type === 'income' ? 'text-emerald-700 bg-emerald-100' : 'text-slate-600 bg-slate-100'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(tx.category)} capitalize`}>
                      {tx.category || 'Other'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold text-right whitespace-nowrap ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {tx.type === 'income' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 text-right whitespace-nowrap">
                    ${(tx.balance || 0).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                  No transactions match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <span className="text-sm text-slate-500">
          Showing {filteredTransactions.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredTransactions.length)} of {filteredTransactions.length} entries
        </span>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
