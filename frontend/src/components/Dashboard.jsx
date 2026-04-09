import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FileDown, Activity, AlertTriangle, CheckCircle, MinusCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Dashboard({ noticias }) {
  const [gerandoPDF, setGerandoPDF] = useState(false);

  // Lógica de contagem para o Gráfico
  const totais = {
    POS: noticias.filter(n => n.sentimento === 'POS').length,
    NEG: noticias.filter(n => n.sentimento === 'NEG').length,
    NEU: noticias.filter(n => n.sentimento === 'NEU').length,
    TOTAL: noticias.length
  };

  const data = [
    { name: 'Positivas', value: totais.POS, color: '#10b981' }, // emerald-500
    { name: 'Negativas', value: totais.NEG, color: '#ef4444' }, // red-500
    { name: 'Neutras', value: totais.NEU, color: '#94a3b8' },   // slate-400
  ];

  // A Mágica do PDF Perfeito
  const exportarPDF = async () => {
    setGerandoPDF(true);
    const element = document.getElementById('relatorio-cigas');
    
    try {
      // Captura a tela com o dobro da resolução (scale: 2) para o PDF não ficar embaçado
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('CIGAS_Relatorio_Midia.pdf');
    } catch (error) {
      console.error("Erro ao gerar PDF", error);
    } finally {
      setGerandoPDF(false);
    }
  };

  return (
    <div className="w-full">
      {/* Botão de Exportar Fica de Fora do PDF */}
      <div className="flex justify-end mb-6">
        <button 
          onClick={exportarPDF} 
          disabled={gerandoPDF}
          className="flex items-center gap-2 px-6 py-3 bg-[#0a2540] dark:bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-lg disabled:opacity-50"
        >
          <FileDown size={20} />
          {gerandoPDF ? 'Processando Documento...' : 'Baixar Relatório Oficial (PDF)'}
        </button>
      </div>

      {/* ÁREA QUE VAI PARA O PDF (Tudo dentro desta div) */}
      <div id="relatorio-cigas" className="bg-white dark:bg-[#0d2640] p-10 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1a3a5c]">
        
        {/* Cabeçalho do Documento */}
        <div className="border-b-2 border-slate-100 dark:border-[#1a3a5c] pb-6 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-[#0a2540] dark:text-white tracking-tight mb-2">Relatório Executivo de Mídia</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Companhia de Gás do Amazonas (CIGÁS)</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Data de Emissão</p>
            <p className="text-slate-500 dark:text-slate-400">{new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          <div className="bg-slate-50 dark:bg-[#071a2f] p-6 rounded-xl border border-slate-100 dark:border-[#1a3a5c]">
            <Activity className="text-blue-500 mb-3" size={28} />
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase">Total Coletado</p>
            <p className="text-3xl font-black text-slate-800 dark:text-white">{totais.TOTAL}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-100 dark:border-red-900/30">
            <AlertTriangle className="text-red-500 mb-3" size={28} />
            <p className="text-sm text-red-800 dark:text-red-400 font-bold uppercase">Risco (Negativas)</p>
            <p className="text-3xl font-black text-red-600 dark:text-red-500">{totais.NEG}</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
            <CheckCircle className="text-emerald-500 mb-3" size={28} />
            <p className="text-sm text-emerald-800 dark:text-emerald-400 font-bold uppercase">Positivas</p>
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-500">{totais.POS}</p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <MinusCircle className="text-slate-500 dark:text-slate-400 mb-3" size={28} />
            <p className="text-sm text-slate-600 dark:text-slate-400 font-bold uppercase">Neutras</p>
            <p className="text-3xl font-black text-slate-700 dark:text-slate-300">{totais.NEU}</p>
          </div>
        </div>

        {/* Gráfico */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-l-4 border-blue-500 pl-3">Distribuição de Sentimento</h2>
          <div className="h-80 bg-slate-50 dark:bg-[#071a2f] rounded-xl border border-slate-100 dark:border-[#1a3a5c] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 mt-10 pt-4 border-t border-slate-100 dark:border-[#1a3a5c]">
          Documento gerado automaticamente pelo Sistema de Monitoramento de Mídia CIGÁS. Confidencial.
        </div>
      </div>
    </div>
  );
}