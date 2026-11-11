import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const loginSchema = z.object({
  email: z.string()
    .min(1, 'O e-mail é obrigatório')
    .email('Formato de e-mail inválido'),
  senha: z.string()
    .min(1, 'A senha é obrigatória')
});

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      setApiError('');
      
      const response = await api.post('/auth/login', data);
      const { token } = response.data;

      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const decoded = JSON.parse(jsonPayload);
      
      const perfilUsuario = decoded.perfil || 'ROLE_VISUALIZADOR';
      
      login(token, { email: data.email, perfil: perfilUsuario });
      
      navigate('/dashboard', { replace: true });
      
    } catch (error) {
      if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        setApiError('Credenciais incorretas. Verifique seu e-mail e senha.');
      } else {
        setApiError('Ocorreu um erro ao conectar com o servidor. Tente mais tarde.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Sistema de Gestão ONG</h1>
          <p className="text-gray-500">Faça o login e acesse o painel administrativo</p>
        </div>

        {apiError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              {...register('email')}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-colors ${
                errors.email ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-600'
              }`}
              placeholder="voluntario@ong.com.br"
            />
            {errors.email && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              {...register('senha')}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-colors ${
                errors.senha ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-600'
              }`}
              placeholder="••••••••"
            />
            {errors.senha && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.senha.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:hover:shadow-none"
          >
            {isSubmitting ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>

        </form>
      </div>
    </div>
  );
}