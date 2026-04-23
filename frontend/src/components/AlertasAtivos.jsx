import { Bell, Activity, CheckCircle, Clock, Trash2, Power, AlertTriangle } from 'lucide-react';

export default function AlertasAtivos() {
  // Simulação das regras que configuramos no n8n
  const regrasAtivas = [
    { id: 1, termo: '"CIGÁS"', categoria: 'Direto', status: 'Ativo', frequencia: '30 min', total_hoje: 12 },
    { id: 2, termo: '"Gás Natural" + Amazonas', categoria: 'Mercado', status: 'Ativo', frequencia: '30 min', total_hoje: 5 },
    { id: 3, termo: 'Gasoduto Amazonas', categoria: 'Infraestrutura', status: 'Pausado', frequencia: '1 hora', total_hoje: 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-500">
      
      {/* Cabeçalho */}
      <div className="flex justify-between items-center bg-white dark:bg-[#0a2540] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-[#1a3a5c]">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <Bell className="text-blue-600" /> Alertas e Monitoramento
          </h1>
          <p className="text-slate-500 text-sm mt-1">Gerencie os termos de busca e a frequência de varredura dos robôs.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-100 dark:border-emerald-800/30 font-bold text-sm">
          <CheckCircle size={16} /> Sistema Online
        </div>
      </div>

      {/* Grid de Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {regrasAtivas.map(regra => (
          <div key={regra.id} className="bg-white dark:bg-[#0a2540] p-6 rounded-2xl border border-slate-100 dark:border-[#1a3a5c] shadow-sm relative overflow-hidden group">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${regra.status === 'Ativo' ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase rounded-md">
                {regra.categoria}
              </span>
              <button className="text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{regra.termo}</h3>
            
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-2"><Clock size={14}/> Frequência</span>
                <span className="text-slate-700 dark:text-slate-200 font-medium">{regra.frequencia}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-2"><Activity size={14}/> Capturadas hoje</span>
                <span className="text-slate-700 dark:text-slate-200 font-medium">{regra.total_hoje} matérias</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${regra.status === 'Ativo' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                <Power size={14} /> {regra.status === 'Ativo' ? 'Pausar' : 'Ativar'}
              </button>
            </div>
          </div>
        ))}

        {/* Card para Adicionar Novo Alerta */}
        <button className="bg-slate-50 dark:bg-slate-800/30 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all group">
          <div className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-sm group-hover:scale-110 transition-transform">
            <Bell size={24} />
          </div>
          <span className="font-bold text-sm">Novo Termo de Monitoramento</span>
        </button>
      </div>

      {/* Aviso de Segurança */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 p-4 rounded-xl flex items-start gap-3">
        <AlertTriangle className="text-blue-600 dark:text-blue-400 mt-0.5" size={18} />
        <div>
          <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300">Dica de Configuração</h4>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">Use aspas para termos exatos (ex: "CIGÁS") para evitar resultados genéricos de outros estados.</p>
        </div>
      </div>

    </div>
  );
}