import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, Dog, Users, FileText, Syringe, Settings, LogOut,
  PawPrint, Menu, X
} from 'lucide-react';

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-800 text-white flex flex-col shadow-xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <PawPrint className="w-8 h-8 text-orange-400" />
            <h2 className="text-lg font-bold leading-tight">Pedacinho<br/>do Céu</h2>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link to="/dashboard" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="/animais" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/animais') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
            <Dog className="w-5 h-5" /> Animais
          </Link>
          <Link to="/tutores" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/tutores') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
            <Users className="w-5 h-5" /> Tutores
          </Link>
          <Link to="/adocoes" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/adocoes') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
            <FileText className="w-5 h-5" /> Adoções
          </Link>
          <Link to="/prontuarios" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/prontuarios') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
            <Syringe className="w-5 h-5" /> Prontuários
          </Link>
          
          {user?.perfil === 'ADMIN' && (
            <Link to="/usuarios" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/usuarios') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
              <Settings className="w-5 h-5" /> Usuários
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
            <LogOut className="w-5 h-5" /> Sair
          </button>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Cabeçalho Responsivo */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800 truncate max-w-[200px] md:max-w-none">
                Olá, {user?.email?.split('@')[0] || 'Usuário'}!
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3 bg-slate-100 py-2 px-3 md:px-4 rounded-full border border-slate-200">
            <Users className="w-4 h-4 md:w-5 md:h-5 text-slate-500" />
            <div className="text-xs md:text-sm">
              <p className="font-semibold text-slate-700">{user?.perfil === 'ADMIN' ? 'Admin' : 'Voluntário'}</p>
            </div>
          </div>
        </header>

        {/* Conteúdo Injetado (Telas filhas) */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
}