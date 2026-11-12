import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '../../services/api';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { BaseModal } from '../ui/BaseModal';
import toast from 'react-hot-toast';

const baseSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório'),
  email: z.string().email('Formato de e-mail inválido'),
  perfil: z.string().min(1, 'Selecione o perfil de acesso'),
});

const createSchema = baseSchema.extend({
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

const editSchema = baseSchema;

export function UsuarioFormModal({ isOpen, onClose, onSuccess, usuarioEditando }) {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const schemaAtual = usuarioEditando ? editSchema : createSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schemaAtual),
  });

  useEffect(() => {
    if (usuarioEditando) {
      reset({
        nome: usuarioEditando.nome,
        email: usuarioEditando.email,
        perfil: usuarioEditando.perfil,
      });
    } else {
      reset({ nome: '', email: '', perfil: 'VISUALIZADOR', senha: '' });
    }
  }, [usuarioEditando, reset, isOpen]);

  const onSubmit = async (data) => {
    try {
      if (usuarioEditando) {
        const payloadPut = {
          nome: data.nome,
          email: data.email,
          perfil: data.perfil
        };
        await api.put(`/usuarios/${usuarioEditando.id}`, payloadPut);
        toast.success('Dados do usuário atualizados com sucesso!');
      } else {
        await api.post('/usuarios', data);
        toast.success('Novo usuário cadastrado com sucesso!');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      if (error.response?.status === 400 || error.response?.status === 409) {
        toast.error('Erro: O e-mail informado já está em uso.');
      } else {
        toast.error('Erro ao salvar os dados do usuário.');
      }
    }
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={usuarioEditando ? 'Editar Dados do Usuário' : 'Cadastrar Novo Usuário'}
      isProcessing={isSubmitting}
    >
      <div className="p-6 overflow-y-auto">
        <form id="usuario-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo *</label>
            <input 
              type="text" 
              placeholder="Ex: Ana Souza"
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
              {...register('nome')}
            />
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail de Acesso *</label>
            <input 
              type="email" 
              placeholder="Ex: ana@ong.com.br"
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
              {...register('email')}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nível de Acesso *</label>
            <select 
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-slate-100"
              {...register('perfil')}
            >
              <option value="VISUALIZADOR">Voluntário (Somente Leitura)</option>
              <option value="ADMIN">Administrador (Acesso Total)</option>
            </select>
            {errors.perfil && <p className="text-red-500 text-xs mt-1">{errors.perfil.message}</p>}
          </div>

          {!usuarioEditando && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha Inicial *</label>
              <div className="relative">
                <input 
                  type={mostrarSenha ? 'text' : 'password'} 
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-10 disabled:bg-slate-100"
                  {...register('senha')}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.senha && <p className="text-red-500 text-xs mt-1">{errors.senha.message}</p>}
            </div>
          )}

        </form>
      </div>

      <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
        <button 
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-5 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button 
          type="submit"
          form="usuario-form"
          disabled={isSubmitting}
          className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {usuarioEditando ? 'Salvar Alterações' : 'Criar Usuário'}
        </button>
      </div>
    </BaseModal>
  );
}