import { useState } from 'react';
import { X, Mail, BellRing, CheckCircle2 } from 'lucide-react';

export default function SubscribeModal({ setShowSubscribeModal }) {
  const [email, setEmail] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Envia o e-mail para o seu banco Django
    fetch(`${import.meta.env.VITE_API_URL}/api/assinantes/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    .then(() => {
      setSucesso(true);
      setTimeout(() => setShowSubscribeModal(false), 2500); // Fecha sozinho após 2.5s
    })
    .catch(err => console.error("Erro ao salvar:", err));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0a2540] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
        
        <button onClick={() => setShowSubscribeModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-50 dark:bg-slate-800 rounded-full p-2 transition-colors z-10">
          <X size={20} />
        </button>

        {!sucesso ? (
          <div className="p-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
              <BellRing className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Fique Atualizado</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
              Assine nossa Newsletter diária e receba alertas imediatos em caso de menções críticas à CIGÁS na mídia.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  required 
                  type="email" 
                  placeholder="Seu e-mail corporativo" 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#071a2f] border border-slate-200 dark:border-[#1a3a5c] text-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-600/50 outline-none transition-all"
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>
              <button type="submit" className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md">
                Assinar Informativo
              </button>
            </form>
          </div>
        ) : (
          <div className="p-10 text-center flex flex-col items-center">
            <CheckCircle2 className="text-emerald-500 mb-4" size={64} />
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Inscrição Confirmada!</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">O seu e-mail foi adicionado com sucesso à nossa lista de monitoramento.</p>
          </div>
        )}

      </div>
    </div>
  );
}