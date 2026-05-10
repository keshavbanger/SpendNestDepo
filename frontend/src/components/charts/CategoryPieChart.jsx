import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#ec4899', '#6366f1', '#14b8a6'];

export default function CategoryPieChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full min-h-[24rem] flex items-center justify-center">
        <p className="text-slate-400">No category spending data</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full min-h-[24rem] flex flex-col">
      <h3 className="text-lg font-bold text-slate-900 mb-2">Spending by Category</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#0f172a' }}
              formatter={(value) => `$${value}`}
            />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px', color: '#64748b', paddingTop: '10px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
