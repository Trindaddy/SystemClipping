import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Download, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function Dashboard({ noticias }) {
  // 1. Cálculos de Estatísticas Rápidas
  const total = noticias.length;
  const positivas = noticias.filter(n => n.sentimento === 'POS').length;
  const negativas = noticias.filter(n => n.sentimento === 'NEG').length;
  const neutras = noticias.filter(n => n.sentimento === 'NEU').length;

  // 2. Preparar dados para o Gráfico de Pizza
  const dadosSentimento = [
    { name: 'Positivas', value: positivas, color: '#10b981' },
    { name: 'Negativas (Crises)', value: negativas, color: '#ef4444' },
    { name: 'Neutras', value: neutras, color: '#94a3b8' }
  ];

  // 3. Função para Imprimir/Gerar PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      
      {/* Cabeçalho do Relatório */}
      <div className="flex justify-between items-center bg-white dark:bg-[#0a2540] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-[#1a3a5c]">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Relatório Consolidado de Mídia</h1>
          <p className="text-slate-500 text-sm mt-1">Análise automatizada de sentimento e volume de publicações.</p>
        </div>
        <button onClick={handlePrint} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-sm print:hidden">
          <Download size={18} /> Salvar PDF
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#0a2540] p-6 rounded-2xl border border-slate-100 dark:border-[#1a3a5c] shadow-sm">
          <div className="text-slate-500 mb-2 font-medium">Total de Menções</div>
          <div className="text-4xl font-black text-slate-800 dark:text-white">{total}</div>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 shadow-sm">
          <div className="text-emerald-600 dark:text-emerald-400 mb-2 font-medium flex items-center gap-2"><CheckCircle size={16}/> Positivas</div>
          <div className="text-4xl font-black text-emerald-700 dark:text-emerald-500">{positivas}</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-100 dark:border-red-800/30 shadow-sm">
          <div className="text-red-600 dark:text-red-400 mb-2 font-medium flex items-center gap-2"><AlertTriangle size={16}/> Crises / Alertas</div>
          <div className="text-4xl font-black text-red-700 dark:text-red-500">{negativas}</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-slate-500 dark:text-slate-400 mb-2 font-medium flex items-center gap-2"><Info size={16}/> Neutras</div>
          <div className="text-4xl font-black text-slate-700 dark:text-slate-300">{neutras}</div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico de Pizza */}
        <div className="bg-white dark:bg-[#0a2540] p-6 rounded-2xl border border-slate-100 dark:border-[#1a3a5c] shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Distribuição de Sentimento</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dadosSentimento} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                  {dadosSentimento.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lista das Últimas Crises (Para o PDF) */}
        <div className="bg-white dark:bg-[#0a2540] p-6 rounded-2xl border border-slate-100 dark:border-[#1a3a5c] shadow-sm overflow-hidden flex flex-col">
          <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} /> Relatório de Crises (Recentes)
          </h2>
          <div className="flex-1 overflow-y-auto pr-2">
            {noticias.filter(n => n.sentimento === 'NEG').slice(0, 4).map(noticia => (
              <div key={noticia.id} className="mb-4 pb-4 border-b border-slate-100 dark:border-[#1a3a5c] last:border-0">
                <div className="text-xs text-slate-400 mb-1">{new Date(noticia.data_publicacao).toLocaleDateString('pt-BR')} - {noticia.fonte_nome}</div>
                <div className="font-bold text-slate-800 dark:text-white text-sm">{noticia.titulo}</div>
              </div>
            ))}
            {negativas === 0 && (
              <div className="text-slate-500 text-sm text-center mt-10">Nenhuma crise registrada no período.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}