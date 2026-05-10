import { useState, useEffect } from 'react';
import { fetchDashboardData } from '../services/api';
import KpiCard from './KpiCard';
import MonthlyChart from './charts/MonthlyChart';
import CategoryPieChart from './charts/CategoryPieChart';
import ForecastChart from './charts/ForecastChart';
import TransactionTable from './TransactionTable';

export default function Dashboard({ initialData, onReset }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const fullData = await fetchDashboardData();
        // Combine the background API analytics with our initial preview table
        setData({ preview: initialData.preview, ...fullData });
      } catch (err) {
        setError("Could not load analytics. " + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [initialData]);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-500 pb-12 pt-8 px-4">
        {/* Header Skeleton */}
        <div className="h-10 w-1/3 bg-slate-200 rounded-xl animate-pulse mb-10"></div>
        
        {/* KPI Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <div className="lg:col-span-2 h-36 bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm"></div>
          <div className="h-36 bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm"></div>
          <div className="h-36 bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm"></div>
          <div className="h-36 bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm"></div>
        </div>

        {/* Charts Skeleton Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 h-[24rem] bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm"></div>
          <div className="lg:col-span-1 h-[24rem] bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm"></div>
        </div>
        
        {/* Charts Skeleton Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 h-[24rem] bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm"></div>
          <div className="lg:col-span-2 h-[24rem] bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-center flex flex-col items-center shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        {error}
        <button onClick={onReset} className="mt-6 bg-white border border-slate-200 text-slate-700 px-6 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">Start Over</button>
      </div>
    );
  }

  const { summary, monthly, category, forecast, recommendation, preview, allTransactions } = data;

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Your Financial Command Center</h2>
          <p className="text-slate-500 mt-2">
            Based on <span className="text-blue-600 font-semibold">{summary.total_transactions}</span> analyzed transactions from <span className="text-slate-700 font-medium">{initialData.filename}</span>.
          </p>
        </div>
        <button 
          onClick={onReset}
          className="bg-white text-sm font-medium text-slate-700 hover:text-slate-900 px-5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors shadow-[0_2px_8px_rgb(0,0,0,0.04)]"
        >
          Upload New File
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-2">
            <KpiCard 
              title="Safe to Spend" 
              amount={recommendation.safe_to_spend} 
              subtext={recommendation.message}
              isHighlight={true}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-100"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              }
            />
        </div>
        <KpiCard 
          title="Total Balance" 
          amount={summary.latest_balance} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          }
        />
        <KpiCard 
          title="Total Income" 
          amount={summary.total_income} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
          }
        />
        <KpiCard 
          title="Total Expenses" 
          amount={summary.total_expenses} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>
          }
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
            <MonthlyChart data={monthly} />
        </div>
        <div className="lg:col-span-1">
            <CategoryPieChart data={category} />
        </div>
      </div>

      {/* Secondary Row: Forecast & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
            <ForecastChart forecastData={forecast} />
        </div>
        <div className="lg:col-span-2">
            <TransactionTable transactions={allTransactions || preview} />
        </div>
      </div>

    </div>
  );
}
