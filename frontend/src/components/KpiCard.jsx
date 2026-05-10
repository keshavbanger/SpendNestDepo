export default function KpiCard({ title, amount, subtext, icon, isHighlight }) {
  return (
    <div className={`p-6 rounded-3xl border relative overflow-hidden transition-transform hover:-translate-y-1 duration-300
      ${isHighlight 
        ? 'bg-blue-600 border-blue-500 text-white shadow-[0_12px_40px_rgba(37,99,235,0.25)]' 
        : 'bg-white border-slate-100 text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}
    `}>
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-sm font-medium ${isHighlight ? 'text-blue-100' : 'text-slate-500'}`}>{title}</h3>
        <div className={`p-2 rounded-xl ${isHighlight ? 'bg-white/20' : 'bg-slate-50 border border-slate-100'}`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-black mb-1 tracking-tight">
        ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      {subtext && (
        <p className={`text-xs mt-3 leading-relaxed ${isHighlight ? 'text-blue-100' : 'text-slate-500'}`}>
          {subtext}
        </p>
      )}
    </div>
  );
}
