import { useState } from 'react';
import { X, Save, Link as LinkIcon, Type, Activity } from 'lucide-react';

export default function AddNewsModal({ setShowAddNewsModal, carregarNoticias }) {
  const [formData, setFormData] = useState({
    titulo: '',
    link_original: '',
    fonte_nome: 'Inserção Manual',
    sentimento: 'NEU',
    conteudo: 'Adicionado manualmente pelo administrador.',
    data_publicacao: new Date().toISOString() // <-- ADICIONANDO A DATA AQUI
  });
  const [salvando, setSalvando] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSalvando(true);

    fetch('http://localhost:8000/api/noticias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(() => {
      carregarNoticias(); // Atualiza a lista na tela de trás
      setShowAddNewsModal(false); // Fecha o modal
    })
    .catch(err => {
      console.error("Erro ao salvar:", err);
      setSalvando(false);
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0a2540] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#1a3a5c]">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Save size={20} className="text-emerald-500" />
            Adicionar Notícia Manual
          </h2>
          <button onClick={() => setShowAddNewsModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título da Matéria</label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input required type="text" className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-[#071a2f] border border-slate-200 dark:border-[#1a3a5c] rounded-xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/50" 
                value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Link Original</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input required type="url" className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-[#071a2f] border border-slate-200 dark:border-[#1a3a5c] rounded-xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/50" 
                value={formData.link_original} onChange={e => setFormData({...formData, link_original: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sentimento / Risco</label>
            <div className="relative">
              <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-[#071a2f] border border-slate-200 dark:border-[#1a3a5c] rounded-xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/50"
                value={formData.sentimento} onChange={e => setFormData({...formData, sentimento: e.target.value})}>
                <option value="NEU">⚪ Neutra</option>
                <option value="POS">✅ Positiva</option>
                <option value="NEG">🚨 Negativa (Crise)</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={salvando} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50">
              {salvando ? 'Salvando no Banco...' : 'Salvar Notícia'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}