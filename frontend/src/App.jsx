import { useEffect, useState } from 'react'
import { Search, RefreshCw, Filter, Plus, LogIn, Moon, Sun, ChevronLeft, ChevronRight, BellRing } from 'lucide-react'

import AuthModal from './components/AuthModal'
import Sidebar from './components/Sidebar'
import NewsCard from './components/NewsCard'
import Dashboard from './components/Dashboard'
import AddNewsModal from './components/AddNewsModal'
import SubscribeModal from './components/SubscribeModal'

function App() {
  const [noticias, setNoticias] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [filtroSentimento, setFiltroSentimento] = useState('TODOS')
  
  const [isLogado, setIsLogado] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showSubscribeModal, setShowSubscribeModal] = useState(false)
  const [showAddNewsModal, setShowAddNewsModal] = useState(false)
  
  const [darkMode, setDarkMode] = useState(false)
  const [telaAtiva, setTelaAtiva] = useState('midia')

  // ==========================================
  // ESTADOS DE PAGINAÇÃO
  // ==========================================
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 12 

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode])

  const carregarNoticias = () => {
    setLoading(true)
    fetch('http://localhost:8000/api/noticias', { cache: 'no-store' })
      .then(response => {
        // 1. Se o servidor responder 404 ou 500, a gente para por aqui e avisa o erro
        if (!response.ok) throw new Error(`Erro no Servidor: ${response.status}`);
        return response.json();
      })
      .then(data => {
        // 2. Se os dados não forem uma lista (Array), a gente também para
        if (!Array.isArray(data)) throw new Error("A API não retornou uma lista válida.");
        
        const unicas = Array.from(new Map(data.map(item => [item.link_original, item])).values());
        const ordenadas = unicas.sort((a, b) => new Date(b.data_publicacao) - new Date(a.data_publicacao))
        setNoticias(ordenadas)
        setLoading(false)
      })
      .catch(error => { 
        console.error("Falha ao carregar notícias:", error); 
        setNoticias([]); // Deixa a lista vazia para a tela não explodir
        setLoading(false);
      })
  }

  useEffect(() => { carregarNoticias() }, [])

  useEffect(() => {
    setPaginaAtual(1)
  }, [busca, filtroSentimento])

  // ==========================================
  // LÓGICA DE FILTRO E PAGINAÇÃO
  // ==========================================
  const noticiasFiltradas = noticias.filter(noticia => {
    const matchBusca = noticia.titulo.toLowerCase().includes(busca.toLowerCase()) || (noticia.conteudo && noticia.conteudo.toLowerCase().includes(busca.toLowerCase()));
    const matchSentimento = filtroSentimento === 'TODOS' || noticia.sentimento === filtroSentimento;
    return matchBusca && matchSentimento;
  })

  const totalPaginas = Math.ceil(noticiasFiltradas.length / itensPorPagina)
  const indexUltimoItem = paginaAtual * itensPorPagina
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina
  const noticiasExibidas = noticiasFiltradas.slice(indexPrimeiroItem, indexUltimoItem)

  return (
    <div className="flex min-h-screen bg-[#F0F4F8] dark:bg-[#071a2f] font-sans relative transition-colors duration-300">
      
      {isLogado && <Sidebar setIsLogado={setIsLogado} darkMode={darkMode} setDarkMode={setDarkMode} setTelaAtiva={setTelaAtiva} telaAtiva={telaAtiva} />}

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isLogado ? 'md:ml-64' : 'w-full'}`}>
        
        {/* Navbar Pública */}
        {!isLogado && (
          <nav className="bg-[#0a2540] dark:bg-[#051424] border-b border-blue-900/50 sticky top-0 z-30 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-4">
                  <img src="/logo-cigas.png" alt="CIGÁS" className="h-8 object-contain brightness-0 invert" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                  <div style={{display: 'none'}} className="items-center gap-2">
                    <span className="text-2xl font-black text-white tracking-tight">CIGÁS</span>
                  </div>
                  <span className="text-blue-800 hidden sm:block">|</span>
                  <span className="text-blue-200 font-medium text-sm hidden sm:block">Portal de Transparência</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setDarkMode(!darkMode)} className="text-blue-300 hover:text-white transition-colors">
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                  
                  <button onClick={() => setShowSubscribeModal(true)} className="hidden sm:flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-semibold rounded-lg transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/40">
                    <BellRing size={16} /> Assinar Alertas
                  </button>

                  <button onClick={() => setShowAuthModal(true)} className="flex items-center gap-2 px-5 py-2 text-white bg-blue-600 hover:bg-blue-500 font-semibold rounded-lg transition-colors border border-blue-500 shadow-sm">
                    <LogIn size={16} /> <span className="hidden sm:inline">Login Admin</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}

        <main className={`p-4 md:p-8 flex-1 ${!isLogado ? 'mx-auto max-w-7xl w-full' : ''}`}>
          
          {/* LÓGICA DE ROTEAMENTO DAS TELAS DO ADMIN ENXUTA */}
          {isLogado && telaAtiva === 'relatorio' && <Dashboard noticias={noticias} />}
          
          {/* TELA PADRÃO (MÍDIA) */}
          {(!isLogado || telaAtiva === 'midia') && (
            <>
              {/* Toolbar */}
              <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white dark:bg-[#0d2640] p-3 md:p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1a3a5c] z-20 transition-colors duration-300">
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
                  <div className="relative group flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input type="text" placeholder="Pesquisar matérias..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#071a2f] border border-slate-200 dark:border-[#1a3a5c] text-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all text-sm" value={busca} onChange={(e) => setBusca(e.target.value)} />
                  </div>
                  
                  <div className="relative">
                    <select value={filtroSentimento} onChange={(e) => setFiltroSentimento(e.target.value)} className="appearance-none pl-10 pr-8 py-2.5 bg-slate-50 dark:bg-[#071a2f] border border-slate-200 dark:border-[#1a3a5c] text-slate-700 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none font-medium text-sm cursor-pointer transition-all">
                      <option value="TODOS">Todos os Sentimentos</option>
                      <option value="NEG">🚨 Negativas</option>
                      <option value="POS">✅ Positivas</option>
                      <option value="NEU">⚪ Neutras</option>
                    </select>
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
                  </div>

                  <button onClick={carregarNoticias} className="p-2.5 bg-slate-50 dark:bg-[#071a2f] border border-slate-200 dark:border-[#1a3a5c] text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1a3a5c] transition-colors" title="Atualizar Dados">
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                  </button>
                </div>

                {isLogado && (
                  <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-[#1a3a5c]">
                    <button onClick={() => setShowAddNewsModal(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-500 transition-colors shadow-sm">
                      <Plus size={18} /><span>Nova Notícia</span>
                    </button>
                  </div>
                )}
              </header>

              {/* Grid de Notícias */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {noticiasExibidas.length > 0 ? (
                  noticiasExibidas.map(noticia => <NewsCard key={noticia.id} noticia={noticia} />)
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
                    <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Nenhum resultado encontrado.</p>
                  </div>
                )}
              </div>

              {/* CONTROLES DE PAGINAÇÃO */}
              {totalPaginas > 1 && (
                <div className="col-span-full flex justify-center items-center gap-6 mt-10">
                  <button 
                    onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                    disabled={paginaAtual === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#0d2640] border border-slate-200 dark:border-[#1a3a5c] text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1a3a5c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-medium"
                  >
                    <ChevronLeft size={18} /> Anterior
                  </button>
                  
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                    Página {paginaAtual} de {totalPaginas}
                  </span>
                  
                  <button 
                    onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                    disabled={paginaAtual === totalPaginas}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#0d2640] border border-slate-200 dark:border-[#1a3a5c] text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1a3a5c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-medium"
                  >
                    Próxima <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {showAuthModal && <AuthModal setShowAuthModal={setShowAuthModal} setIsLogado={setIsLogado} />}
      {showSubscribeModal && <SubscribeModal setShowSubscribeModal={setShowSubscribeModal} />}
      {showAddNewsModal && <AddNewsModal setShowAddNewsModal={setShowAddNewsModal} carregarNoticias={carregarNoticias} />}
      
    </div>
  )
}

export default App