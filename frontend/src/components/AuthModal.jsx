import { useState } from 'react';
import { X, Mail, Lock, User, EyeOff, Eye, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AuthModal({ setShowAuthModal, setIsLogado }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formAuth, setFormAuth] = useState({ nome: '', email: '', senha: '', confirmaSenha: '' });

  const checkPasswordStrength = (pass) => ({
    length: pass.length >= 8,
    upper: /[A-Z]/.test(pass),
    number: /[0-9]/.test(pass)
  });

  const strength = checkPasswordStrength(formAuth.senha);
  const senhasBatem = formAuth.senha === formAuth.confirmaSenha && formAuth.senha.length > 0;

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (isRegistering && !senhasBatem) return;
    setTimeout(() => { setIsLogado(true); setShowAuthModal(false); }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300">
        
        {/* Painel de Branding */}
        <div className="hidden md:flex w-5/12 bg-[#0a2540] p-10 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-[80px] opacity-40"></div>
          <div className="relative z-10">
            <ShieldCheck size={48} className="text-blue-400 mb-6" />
            <h2 className="text-3xl font-black leading-tight mb-4">Portal<br/>Admin</h2>
            <p className="text-slate-300 text-sm leading-relaxed">Acesso exclusivo para gestão de crises e monitoramento avançado de mídia da CIGÁS.</p>
          </div>
          <div className="relative z-10 text-xs text-slate-500 font-medium">© 2026 CIGÁS - Ambiente Seguro</div>
        </div>

        {/* Formulário */}
        <div className="w-full md:w-7/12 p-8 md:p-12 relative bg-white">
          <button onClick={() => setShowAuthModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-full p-2 transition-colors">
            <X size={20} />
          </button>

          <div className="flex gap-8 border-b border-slate-100 mb-8">
            <button onClick={() => setIsRegistering(false)} className={`pb-3 text-sm font-bold transition-colors border-b-2 ${!isRegistering ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-400 hover:text-slate-700'}`}>Login</button>
            <button onClick={() => setIsRegistering(true)} className={`pb-3 text-sm font-bold transition-colors border-b-2 ${isRegistering ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-400 hover:text-slate-700'}`}>Criar Conta</button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-5">
            {isRegistering && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type="text" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all" value={formAuth.nome} onChange={e => setFormAuth({...formAuth, nome: e.target.value})} />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input required type="email" placeholder="usuario@cigas.com.br" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all" value={formAuth.email} onChange={e => setFormAuth({...formAuth, email: e.target.value})} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-600">Senha</label>
                {!isRegistering && <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-800">Esqueceu?</a>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input required type={showPassword ? "text" : "password"} className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all" value={formAuth.senha} onChange={e => setFormAuth({...formAuth, senha: e.target.value})} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isRegistering && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Confirmar Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type="password" className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all ${formAuth.confirmaSenha.length > 0 ? (senhasBatem ? 'border-emerald-500 focus:ring-emerald-500/20' : 'border-red-400 focus:ring-red-400/20') : 'border-slate-200 focus:ring-blue-600/20 focus:border-blue-600'}`} value={formAuth.confirmaSenha} onChange={e => setFormAuth({...formAuth, confirmaSenha: e.target.value})} />
                </div>
              </div>
            )}

            <button type="submit" className="w-full py-3.5 mt-2 bg-[#0a2540] text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors shadow-sm">
              {isRegistering ? 'Criar Conta' : 'Acessar Painel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}