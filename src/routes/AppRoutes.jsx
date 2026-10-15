import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

import { Login } from '../pages/Login.jsx';
import { Dashboard } from '../pages/Dashboard.jsx';
import { Animais } from '../pages/Animais.jsx';
import { Tutores } from '../pages/Tutores.jsx';
import { Adocoes } from '../pages/Adocoes.jsx';
import { Prontuarios } from '../pages/Prontuarios.jsx';
import { Usuarios } from '../pages/Usuarios.jsx';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= ROTAS PÚBLICAS ================= */}
        <Route path="/login" element={<Login />} />

        {/* ================= ROTAS PRIVADAS (Exigem Token JWT) ================= */}
        {/* Comportamento visual: ambos ADMIN e USER acessam para consulta */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/animais" element={<Animais />} />
          <Route path="/tutores" element={<Tutores />} />
          <Route path="/adocoes" element={<Adocoes />} />
          <Route path="/prontuarios" element={<Prontuarios />} />
        </Route>

        {/* ================= ROTAS RESTRITAS AO ADMIN ================= */}
        {/* Gestão de voluntários/usuários do sistema */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/usuarios" element={<Usuarios />} />
        </Route>

        {/* ================= REDIRECIONAMENTOS PADRÃO (Fallback) ================= */}
        {/* Se acessar a raiz "/", joga para o dashboard (que validará o token) */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Qualquer URL inválida volta para o início */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}