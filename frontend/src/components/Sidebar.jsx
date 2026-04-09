import { Newspaper, BarChart2, Bell, LogOut, ShieldCheck, Moon, Sun } from 'lucide-react';

export default function Sidebar({ setIsLogado, setShowAlertModal, darkMode, setDarkMode, telaAtiva, setTelaAtiva }) {
  return (
    <aside className="w-64 bg-[#0a2540] dark:bg-[#051424] text-slate-300 fixed h-full hidden md:flex flex-col z-10 shadow-2xl transition-colors duration-300">
      <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-emerald-500" size={28} />
          <div>
            <h1 className="text-lg font-black tracking-tight text-white leading-none">CIGÁS Admin</h1>
          </div>
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className="text-slate-400 hover:text-white transition-colors">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      
      <nav className="mt-8 flex-1 px-4 space-y-1.5">
        <button 
          onClick={() => setTelaAtiva('midia')} 
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${telaAtiva === 'midia' ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400' : 'hover:bg-slate-800/50 hover:text-white'}`}
        >
          <Newspaper size={18} /> Painel de Mídia
        </button>
        <button 
          onClick={() => setTelaAtiva('relatorio')} 
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${telaAtiva === 'relatorio' ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400' : 'hover:bg-slate-800/50 hover:text-white'}`}
        >
          <BarChart2 size={18} /> Relatórios (PDF)
        </button>
        <button onClick={() => setShowAlertModal(true)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl font-medium transition-colors">
          <Bell size={18} /> Alertas Ativos
        </button>
      </nav>

      <div className="p-6 border-t border-slate-700/50">
        <button onClick={() => setIsLogado(false)} className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors font-medium">
          <LogOut size={16} /> Encerrar Sessão
        </button>
      </div>
    </aside>
  );
}