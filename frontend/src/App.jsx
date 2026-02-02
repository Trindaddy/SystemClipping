import { useEffect, useState, useRef } from 'react'
import { LayoutDashboard, Newspaper, Search, ExternalLink, RefreshCw, X } from 'lucide-react'

function App() {
  const [noticias, setNoticias] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('') // Estado da pesquisa
  const searchInputRef = useRef(null) // Para focar na barra

  const carregarNoticias = () => {
    setLoading(true)
    fetch('http://localhost:8000/api/noticias')
      .then(response => response.json())
      .then(data => {
        // Ordena por data (mais recente primeiro)
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

  // Função para focar na pesquisa quando clica no menu
  const ativarPesquisa = (e) => {
    e.preventDefault()
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  // Lógica de filtragem
  const noticiasFiltradas = noticias.filter(noticia => 
    noticia.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    (noticia.conteudo && noticia.conteudo.toLowerCase().includes(busca.toLowerCase()))
  )

  const getSentimentColor = (sentimento) => {
    if (sentimento === 'POS') return 'bg-green-100 text-green-800 border-green-200'
    if (sentimento === 'NEG') return 'bg-red-100 text-red-800 border-red-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit' })
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      
      {/* Sidebar Fixa */}
      <aside className="w-64 bg-slate-900 text-white fixed h-full hidden md:flex flex-col z-10">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <LayoutDashboard className="text-blue-400" /> 
            Clipping<span className="text-blue-400">Pro</span>
          </h1>
        </div>
        <nav className="mt-6 flex-1">
          <a href="#" onClick={() => setBusca('')} className={`flex items-center gap-3 px-6 py-3 transition ${busca === '' ? 'bg-slate-800 border-r-4 border-blue-400' : 'text-slate-400 hover:text-white'}`}>
            <Newspaper size={20} />
            Monitoramento
          </a>
          <a href="#" onClick={ativarPesquisa} className={`flex items-center gap-3 px-6 py-3 transition ${busca !== '' ? 'bg-slate-800 border-r-4 border-blue-400 text-white' : 'text-slate-400 hover:text-white'}`}>
            <Search size={20} />
            Pesquisa Avançada
          </a>
        </nav>
        <div className="p-6 text-xs text-slate-500">
          v1.0.0 - Sistema Demo
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        
        {/* Cabeçalho com Barra de Pesquisa */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-4 z-20">
          <div className="w-full md:w-auto">
            <h2 className="text-2xl font-bold text-gray-800">
              {busca ? `Resultados para "${busca}"` : 'Últimas Notícias'}
            </h2>
            <p className="text-gray-500 text-sm hidden md:block">
              {busca ? `${noticiasFiltradas.length} encontradas` : 'Monitorando fontes em tempo real'}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Campo de Busca */}
            <div className="relative group w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" size={18} />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Buscar palavra-chave..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              {busca && (
                <button onClick={() => setBusca('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                  <X size={14} />
                </button>
              )}
            </div>

            <button 
              onClick={carregarNoticias}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm active:scale-95 whitespace-nowrap"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
          </div>
        </header>

        {/* Grid de Notícias */}
        {loading && noticias.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <RefreshCw size={40} className="animate-spin mb-4 text-blue-200" />
            <p>Sincronizando feed...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {noticiasFiltradas.length > 0 ? (
              noticiasFiltradas.map(noticia => (
                <article key={noticia.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {noticia.fonte_nome || "WEB"}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${getSentimentColor(noticia.sentimento)}`}>
                        {noticia.sentimento}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-blue-700 transition-colors">
                      {noticia.titulo}
                    </h3>
                    
                    <p className="text-gray-500 text-sm line-clamp-3">
                      {noticia.conteudo || "Clique para ler a matéria completa na fonte original."}
                    </p>
                  </div>

                  <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">
                      {formatDate(noticia.data_publicacao)}
                    </span>
                    <a 
                      href={noticia.link_original} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-semibold hover:underline"
                    >
                      Ler original <ExternalLink size={14} />
                    </a>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Nenhum resultado encontrado</h3>
                <p className="text-gray-500">Tente buscar por outro termo.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App