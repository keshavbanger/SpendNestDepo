import { useState } from 'react';
import UploadComponent from './components/UploadComponent';
import Dashboard from './components/Dashboard';
import LandingPage from './components/landing/LandingPage';

function App() {
  const [isAppStarted, setIsAppStarted] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  if (!isAppStarted) {
    return <LandingPage onStartApp={() => setIsAppStarted(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative overflow-hidden">
      
      {/* Light Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100 via-blue-50/50 to-transparent blur-[100px]"></div>
      </div>

      {/* App Header */}
      <header className="w-full py-6 px-8 border-b border-slate-200/60 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center bg-white/50">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => { setIsAppStarted(false); setDashboardData(null); }}
        >
          <div className="w-10 h-10 flex items-center justify-center relative">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="12" r="7" fill="currentColor" className="text-blue-600/80" />
              <circle cx="15" cy="12" r="7" fill="currentColor" className="text-indigo-400/80" />
            </svg>
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 transition-colors">
            SpendNest <span className="text-sm font-normal text-blue-600 ml-2">App</span>
          </span>
        </div>
        <nav className="hidden md:flex gap-6 items-center">
          <button 
            onClick={() => setIsAppStarted(false)} 
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            Back to Home
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-start pt-16 px-6 w-full max-w-6xl mx-auto pb-24 relative z-10">
        
        {!dashboardData && (
          <div className="text-center mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900">
              Upload your statement
            </h1>
            <p className="text-slate-500">
              Drag and drop your bank CSV file below to instantly generate your financial dashboard.
            </p>
          </div>
        )}

        {!dashboardData ? (
          <UploadComponent onUploadSuccess={setDashboardData} />
        ) : (
          <Dashboard initialData={dashboardData} onReset={() => setDashboardData(null)} />
        )}

      </main>

    </div>
  );
}

export default App;
