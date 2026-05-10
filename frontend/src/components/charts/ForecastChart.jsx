import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ForecastChart({ forecastData }) {
  if (!forecastData || !forecastData.historical_income) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full min-h-[24rem] flex items-center justify-center">
        <p className="text-slate-400">Not enough data to forecast</p>
      </div>
    );
  }

  // Combine historical and predicted into one continuous timeline
  const chartData = [
    ...forecastData.historical_income.map(item => ({ month: item.month, Actual: item.income, Predicted: null })),
    { month: forecastData.predicted_month, Actual: null, Predicted: forecastData.predicted_income }
  ];

  // Connect the solid actual line to the dashed predicted line
  if (forecastData.historical_income.length > 0) {
    const lastHistorical = forecastData.historical_income[forecastData.historical_income.length - 1];
    const targetItem = chartData.find(d => d.month === lastHistorical.month);
    targetItem.Predicted = lastHistorical.income;
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full min-h-[24rem]">
      <h3 className="text-lg font-bold text-slate-900 mb-1">Income Forecast</h3>
      <p className="text-xs text-slate-500 mb-6">3-month Simple Moving Average Prediction</p>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="month" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
          <YAxis stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Line type="monotone" dataKey="Actual" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#ffffff' }} activeDot={{ r: 6 }} />
          <Line type="dashed" dataKey="Predicted" stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#ffffff' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
