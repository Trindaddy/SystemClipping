import { ExternalLink, Calendar, Activity, Edit2, Trash2 } from 'lucide-react';

export default function NewsCard({ noticia, onDelete, onEdit, isLogado }) {
  // Traduz o sentimento em cores e textos
  const sentimentoConfig = {
    'POS': { cor: 'bg-emerald-500', texto: 'Positiva', glow: 'shadow-emerald-500/20' },
    'NEG': { cor: 'bg-red-500', texto: 'Crítica', glow: 'shadow-red-500/20' },
    'NEU': { cor: 'bg-slate-400', texto: 'Neutra', glow: 'shadow-slate-400/20' }
  };

  const config = sentimentoConfig[noticia.sentimento] || sentimentoConfig['NEU'];

  // Formata a data para padrão brasileiro
  const dataFormatada = new Date(noticia.data_publicacao).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  // Mágica do Item 1: Limpa o nome da fonte se for genérico
  const obterNomeFonte = () => {
    if (noticia.fonte_nome === 'Monitoramento Web' || noticia.fonte_nome === 'Inserção Manual') {
      try {
        const url = new URL(noticia.link_original);
        return url.hostname.replace('www.', '').replace('news.google.com', 'Google News');
      } catch (e) {
        return 'Web';
      }
    }
    return noticia.fonte_nome;
  };

  // Mágica do Item 8: Limpa resumos inúteis
  const obterResumo = () => {
    const texto = noticia.conteudo || noticia.resumo || "";
    if (texto.includes("Conteúdo disponível na fonte original") || texto.length < 10) {
      return "Clique no título da matéria para ler a reportagem na íntegra no portal de origem.";
    }
    return texto;
  };

  return (
    <div className={`bg-white dark:bg-[#0a2540] rounded-2xl p-6 border border-slate-100 dark:border-[#1a3a5c] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full relative overflow-hidden group`}>
      
      {/* Barra de cor lateral */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.cor}`}></div>

      {/* Cabeçalho do Card */}
      <div className="flex justify-between items-start mb-4 pl-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <Activity size={14} className={config.cor.replace('bg-', 'text-')} />
          {obterNomeFonte()}
        </div>
        
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white ${config.cor} shadow-sm`}>
          {config.texto}
        </span>
      </div>

      {/* Título e Resumo */}
      <div className="pl-2 flex-1">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <a href={noticia.link_original} target="_blank" rel="noopener noreferrer" className="before:absolute before:inset-0">
            {noticia.titulo}
          </a>
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 leading-relaxed">
          {obterResumo()}
        </p>
      </div>

      {/* Rodapé do Card */}
      <div className="mt-6 pl-2 pt-4 border-t border-slate-100 dark:border-[#1a3a5c] flex justify-between items-center text-xs text-slate-400 dark:text-slate-500">
        <div className="flex items-center gap-1.5">
          <Calendar size={14} />
          {dataFormatada}
        </div>
        
        <div className="flex items-center gap-3">
          {/* BOTÕES DE CRUD APARECEM APENAS PARA O ADMIN */}
          {isLogado && (
            // A MÁGICA ESTÁ AQUI: relative z-20 traz os botões para cima do link invisível
            <div className="flex items-center gap-2 mr-2 relative z-20">
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }} 
                className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors" 
                title="Editar Notícia">
                <Edit2 size={16} />
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }} 
                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors" 
                title="Excluir Notícia">
                <Trash2 size={16} />
              </button>
            </div>
          )}
          
          <a href={noticia.link_original} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors z-20 relative">
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}