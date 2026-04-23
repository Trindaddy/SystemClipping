import { LayoutGrid, PieChart, LogOut, ShieldCheck, Settings, Moon, Sun } from 'lucide-react';

export default function Sidebar({ setIsLogado, setTelaAtiva, telaAtiva, darkMode, setDarkMode }) {
  
  // Menu enxuto: Apenas Mídia e Relatórios
  const menuItems = [
    { id: 'midia', label: 'Painel de Mídia', icon: LayoutGrid },
    { id: 'relatorio', label: 'Relatórios PDF', icon: PieChart },
  ];

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-[#0a2540] border-r border-slate-100 dark:border-[#1a3a5c] flex flex-col fixed inset-y-0 left-0 z-40 transition-colors duration-300 shadow-lg md:shadow-none">
      
      {/* Cabeçalho */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-100 dark:border-[#1a3a5c]">
        <div className="p-2 bg-blue-600 rounded-lg text-white shadow-sm">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight">Admin</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Monitoramento</p>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2 mt-4">Menu Principal</div>
        
        {menuItems.map((item) => {
          const Icone = item.icon;
          const ativo = telaAtiva === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setTelaAtiva(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                ativo 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Icone size={20} className={ativo ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Rodapé */}
      <div className="p-4 border-t border-slate-100 dark:border-[#1a3a5c] space-y-2">
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl font-semibold transition-colors"
        >
          {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-400" />}
          {darkMode ? 'Modo Claro' : 'Modo Escuro'}
        </button>
        
        <button 
          onClick={() => setIsLogado(false)} 
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-xl font-semibold transition-colors"
        >
          <LogOut size={20} /> Sair do Sistema
        </button>
      </div>
    </aside>
  );
}