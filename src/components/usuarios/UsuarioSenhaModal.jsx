import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '../../services/api';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { BaseModal } from '../ui/BaseModal';

const senhaSchema = z.object({
  senhaAtual: z.string().min(1, 'A senha atual é obrigatória'),
  novaSenha: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres'),
});

export function UsuarioSenhaModal({ isOpen, onClose, onSuccess, usuarioId }) {
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(senhaSchema),
  });

  useEffect(() => {
    if (!isOpen) {
      reset({ senhaAtual: '', novaSenha: '' });
      setMostrarSenhaAtual(false);
      setMostrarNovaSenha(false);
    }
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    try {
      await api.patch(`/usuarios/${usuarioId}/senha`, data);
      
      alert('Senha alterada com sucesso!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      if (error.response?.status === 400) {
        alert('A senha atual informada está incorreta.');
      } else {
        alert('Erro ao alterar a senha. Verifique sua conexão.');
      }
    }
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Alterar Senha de Acesso"
      isProcessing={isSubmitting}
    >
      <div className="p-6 overflow-y-auto">
        <form id="senha-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha Atual *</label>
            <div className="relative">
              <input 
                type={mostrarSenhaAtual ? 'text' : 'password'} 
                placeholder="Digite a senha atual"
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-10 disabled:bg-slate-100 focus:outline-none"
                {...register('senhaAtual')}
              />
              <button
                type="button"
                onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {mostrarSenhaAtual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.senhaAtual && <p className="text-red-500 text-xs mt-1">{errors.senhaAtual.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nova Senha *</label>
            <div className="relative">
              <input 
                type={mostrarNovaSenha ? 'text' : 'password'} 
                placeholder="Mínimo 6 caracteres"
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-10 disabled:bg-slate-100 focus:outline-none"
                {...register('novaSenha')}
              />
              <button
                type="button"
                onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {mostrarNovaSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.novaSenha && <p className="text-red-500 text-xs mt-1">{errors.novaSenha.message}</p>}
          </div>
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
          form="senha-form"
          disabled={isSubmitting}
          className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-70 transition-colors flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Confirmar Alteração
        </button>
      </div>
    </BaseModal>
  );
}