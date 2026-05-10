import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MonthlyChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-96 flex items-center justify-center">
        <p className="text-slate-400">Not enough data for monthly chart</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full min-h-[24rem]">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Income vs Expenses</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="month" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
          <YAxis stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#0f172a' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="income" name="Income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
