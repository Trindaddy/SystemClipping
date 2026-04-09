import { ExternalLink } from 'lucide-react';

export default function NewsCard({ noticia }) {
  const getSentimentStyle = (sentimento) => {
    if (sentimento === 'POS') return 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
    if (sentimento === 'NEG') return 'bg-red-100/80 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50';
    return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  }

  return (
    <article className="bg-white dark:bg-[#0d2640] rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-[#1a3a5c] flex flex-col group">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-center mb-5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg">
            {noticia.fonte_nome || "WEB"}
          </span>
          <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border ${getSentimentStyle(noticia.sentimento)}`}>
            {noticia.sentimento === 'NEG' ? '🚨 NEGATIVA' : noticia.sentimento === 'POS' ? '✅ POSITIVA' : '⚪ NEUTRA'}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-snug mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {noticia.titulo}
        </h3>
        
        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">
          {noticia.conteudo || "Conteúdo disponível na fonte original."}
        </p>
      </div>
      
      <div className="px-6 py-4 border-t border-slate-100 dark:border-[#1a3a5c] flex justify-between items-center bg-slate-50/50 dark:bg-[#0a1f35]/50">
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          {new Date(noticia.data_publicacao).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit' })}
        </span>
        <a href={noticia.link_original || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1.5 text-sm font-semibold transition-colors">
          Ler Matéria <ExternalLink size={14} />
        </a>
      </div>
    </article>
  );
}