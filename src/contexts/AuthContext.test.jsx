import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { STORAGE_KEYS } from '../utils/storageKeys';

const TestComponent = () => {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="user-role">{user ? user.perfil : 'Sem usuário'}</span>
      <button onClick={() => login('token123', { perfil: 'ADMIN' })}>Fazer Login</button>
      <button onClick={logout}>Fazer Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => localStorage.clear());

  it('deve realizar login, salvar no localStorage e atualizar o estado', () => {
    render(<AuthProvider><TestComponent /></AuthProvider>);
    
    act(() => {
      screen.getByText('Fazer Login').click();
    });

    expect(screen.getByTestId('user-role')).toHaveTextContent('ADMIN');
    expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBe('token123');
  });

  it('deve limpar os dados ao fazer logout', () => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, 'token123');
    
    render(<AuthProvider><TestComponent /></AuthProvider>);
    
    act(() => {
      screen.getByText('Fazer Logout').click();
    });

    expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
    expect(screen.getByTestId('user-role')).toHaveTextContent('Sem usuário');
  });
});