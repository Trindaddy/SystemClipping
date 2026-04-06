import { useEffect, useState, useRef } from 'react'
import { LayoutDashboard, Newspaper, Search, ExternalLink, RefreshCw, X, Download, Bell, BarChart2 } from 'lucide-react'

function App() {
  const [noticias, setNoticias] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const searchInputRef = useRef(null)

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

  const noticiasFiltradas = noticias.filter(noticia => 
    noticia.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    (noticia.conteudo && noticia.conteudo.toLowerCase().includes(busca.toLowerCase()))
  )

  const getSentimentStyle = (sentimento) => {
    if (sentimento === 'POS') return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    if (sentimento === 'NEG') return 'bg-red-600 text-white border-red-700 animate-pulse' // Destaque extra pedido no edital
    return 'bg-slate-100 text-slate-800 border-slate-200'
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
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
        <div className="p-6">
          <div className="bg-slate-800 rounded-lg p-4 text-xs text-slate-400 border border-slate-700">
            <p>Status: <span className="text-emerald-400 font-bold">Online</span></p>
            <p className="mt-1">Última sync: Agora</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        
        {/* Header CIGÁS */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 sticky top-4 z-20">
          <div className="w-full md:w-auto">
            <h2 className="text-2xl font-bold text-slate-800">
              {busca ? `Busca: "${busca}"` : 'Monitoramento em Tempo Real'}
            </h2>
            <p className="text-slate-500 text-sm">Visualizando todas as fontes homologadas</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar palavra-chave..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            
            {/* Botão de Exportar PDF (Simulação visual por enquanto) */}
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition shadow-sm whitespace-nowrap">
              <Download size={18} />
              <span className="hidden sm:inline">Exportar PDF</span>
            </button>

            <button onClick={carregarNoticias} className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </header>

        {/* Notícias Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {noticiasFiltradas.map(noticia => (
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
                <a href={noticia.link_original} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-bold">
                  Ver Fonte <ExternalLink size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App