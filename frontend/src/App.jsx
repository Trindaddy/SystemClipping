import { useEffect, useState, useRef } from 'react'
import { LayoutDashboard, Newspaper, Search, ExternalLink, RefreshCw, Download, Bell, BarChart2, Filter, Plus, X } from 'lucide-react'

function App() {
  const [noticias, setNoticias] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [filtroSentimento, setFiltroSentimento] = useState('TODOS')
  
  // ESTADOS DO MODAL MANUAL
  const [showModal, setShowModal] = useState(false)
  const [formManual, setFormManual] = useState({
    titulo: '',
    conteudo: '',
    link_original: '',
    fonte_nome: '',
    sentimento: 'NEU'
  })

  const carregarNoticias = () => {
    setLoading(true)
    fetch('http://localhost:8000/api/noticias')
      .then(response => response.json())
      .then(data => {
        const ordenadas = data.sort((a, b) => new Date(b.data_publicacao) - new Date(a.data_publicacao))
        setNoticias(ordenadas)
        setLoading(false)
      })
      .catch(error => {
        console.error("Erro:", error)
        setLoading(false)
      })
  }

  useEffect(() => {
    carregarNoticias()
  }, [])

  // FUNÇÃO PARA SALVAR NOTÍCIA MANUAL
  const handleSalvarManual = async (e) => {
    e.preventDefault();
    const payload = {
      ...formManual,
      // Força a data atual para a notícia manual
      data_publicacao: new Date().toISOString() 
    };

    try {
      // Faz o POST para a sua API Django
      const response = await fetch('http://localhost:8000/api/noticias/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowModal(false); // Fecha o modal
        setFormManual({ titulo: '', conteudo: '', link_original: '', fonte_nome: '', sentimento: 'NEU' }); // Limpa o form
        carregarNoticias(); // Recarrega a tela para mostrar a nova notícia
      } else {
        alert("Erro ao salvar a notícia no banco de dados.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  }

  const noticiasFiltradas = noticias.filter(noticia => {
    const matchBusca = noticia.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                       (noticia.conteudo && noticia.conteudo.toLowerCase().includes(busca.toLowerCase()));
    const matchSentimento = filtroSentimento === 'TODOS' || noticia.sentimento === filtroSentimento;
    return matchBusca && matchSentimento;
  })

  const getSentimentStyle = (sentimento) => {
    if (sentimento === 'POS') return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    if (sentimento === 'NEG') return 'bg-red-600 text-white border-red-700 animate-pulse'
    return 'bg-slate-100 text-slate-800 border-slate-200'
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans relative">
      
      {/* Sidebar CIGÁS */}
      <aside className="w-64 bg-[#0a2540] text-white fixed h-full hidden md:flex flex-col z-10 shadow-xl">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-black tracking-tight text-white flex flex-col gap-1">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Ambiente Exclusivo</span>
            CIGÁS Clipping
          </h1>
        </div>
        <nav className="mt-6 flex-1 px-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-lg text-white font-medium shadow-md">
            <Newspaper size={20} /> Painel de Notícias
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition">
            <BarChart2 size={20} /> Relatórios Analíticos
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition">
            <Bell size={20} /> Alertas Configuráveis
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 sticky top-4 z-20">
          <div className="w-full md:w-auto">
            <h2 className="text-2xl font-bold text-slate-800">
              Monitoramento Integrado
            </h2>
            <p className="text-slate-500 text-sm">Visualizando {noticiasFiltradas.length} notícias classificadas</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            
            {/* BOTÃO NOVA NOTÍCIA MANUAL */}
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition shadow-sm whitespace-nowrap"
            >
              <Plus size={18} />
              <span>Nova Notícia</span>
            </button>

            <div className="relative">
              <select
                value={filtroSentimento}
                onChange={(e) => setFiltroSentimento(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium text-sm cursor-pointer"
              >
                <option value="TODOS">Todos os Sentimentos</option>
                <option value="NEG">🚨 Apenas Negativas</option>
                <option value="POS">✅ Apenas Positivas</option>
                <option value="NEU">⚪ Apenas Neutras</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>

            <div className="relative group flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar palavra-chave..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            
            <button onClick={carregarNoticias} className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition" title="Atualizar Dados">
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </header>

        {/* Notícias Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {noticiasFiltradas.length > 0 ? (
            noticiasFiltradas.map(noticia => (
              <article key={noticia.id} className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden flex flex-col hover:shadow-lg transition ${noticia.sentimento === 'NEG' ? 'border-red-200' : 'border-transparent'}`}>
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-3 py-1 rounded-full">
                      {noticia.fonte_nome || "WEB"}
                    </span>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${getSentimentStyle(noticia.sentimento)}`}>
                      {noticia.sentimento === 'NEG' ? '🚨 NEGATIVA' : noticia.sentimento === 'POS' ? 'POSITIVA' : 'NEUTRA'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight mb-3">
                    {noticia.titulo}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-3">
                    {noticia.conteudo || "Conteúdo disponível na fonte original."}
                  </p>
                </div>
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">
                    {new Date(noticia.data_publicacao).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit' })}
                  </span>
                  <a href={noticia.link_original || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-bold">
                    Ver Fonte <ExternalLink size={14} />
                  </a>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed">
              <Search size={48} className="mb-4 text-slate-300" />
              <p className="text-lg font-medium">Nenhuma notícia encontrada para este filtro.</p>
            </div>
          )}
        </div>
      </main>

      {/* MODAL DE CADASTRO MANUAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Inserir Notícia Manual</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSalvarManual} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título da Matéria *</label>
                <input required type="text" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  value={formManual.titulo} onChange={e => setFormManual({...formManual, titulo: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Resumo / Conteúdo</label>
                <textarea rows="3" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  value={formManual.conteudo} onChange={e => setFormManual({...formManual, conteudo: e.target.value})}></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Veículo / Fonte *</label>
                  <input required type="text" placeholder="Ex: TV Amazonas" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                    value={formManual.fonte_nome} onChange={e => setFormManual({...formManual, fonte_nome: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sentimento</label>
                  <select className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                    value={formManual.sentimento} onChange={e => setFormManual({...formManual, sentimento: e.target.value})}>
                    <option value="NEU">⚪ Neutro</option>
                    <option value="POS">✅ Positivo</option>
                    <option value="NEG">🚨 Negativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Link Original (Opcional)</label>
                <input type="url" placeholder="https://" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  value={formManual.link_original} onChange={e => setFormManual({...formManual, link_original: e.target.value})} />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md">Salvar no Banco</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default App