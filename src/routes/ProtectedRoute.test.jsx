import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthProvider } from '../contexts/AuthContext';
import { STORAGE_KEYS } from '../utils/storageKeys';

describe('ProtectedRoute', () => {
  beforeEach(() => localStorage.clear());

  it('deve redirecionar para /login se não houver token válido', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/login" element={<h1>Tela de Login</h1>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<h1>Tela de Dashboard</h1>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText('Tela de Login')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard Protegido')).not.toBeInTheDocument();
  });
});