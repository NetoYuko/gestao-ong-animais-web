import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '../../services/api';
import { Loader2 } from 'lucide-react';
import { BaseModal } from '../ui/BaseModal';
import toast from 'react-hot-toast';

const tutorSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório'),
  cpf: z.string().min(11, 'O CPF é obrigatório'),
  telefone: z.string().min(1, 'O telefone é obrigatório'),
  endereco: z.string().min(1, 'O endereço é obrigatório'),
});

export function TutorFormModal({ isOpen, onClose, onSuccess, tutorEditando }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(tutorSchema),
  });

  useEffect(() => {
    if (tutorEditando) {
      reset(tutorEditando);
    } else {
      reset({ nome: '', cpf: '', telefone: '', endereco: '' });
    }
  }, [tutorEditando, reset, isOpen]);

  const onSubmit = async (data) => {
    try {
      if (tutorEditando) {
        await api.put(`/tutores/${tutorEditando.id}`, data);
        toast.success('Tutor atualizado com sucesso!');
      } else {
        await api.post('/tutores', data);
        toast.success('Tutor cadastrado com sucesso!');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar tutor:', error);
      if (error.response?.status === 400 || error.response?.status === 409) {
        toast.error('Erro: Verifique os dados. Este CPF já pode estar cadastrado.');
      } else {
        toast.error('Erro ao salvar os dados. Verifique sua conexão.');
      }
    }
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={tutorEditando ? 'Editar Tutor' : 'Cadastrar Novo Tutor'}
      isProcessing={isSubmitting}
    >
      <div className="p-6 overflow-y-auto">
        <form id="tutor-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo *</label>
            <input 
              type="text" 
              placeholder="Ex: João da Silva"
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-100"
              {...register('nome')}
            />
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CPF *</label>
              <input 
                type="text" 
                placeholder="Ex: 123.456.789-00"
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-100"
                {...register('cpf')}
              />
              {errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Telefone / WhatsApp *</label>
              <input 
                type="text" 
                placeholder="Ex: (82) 99999-9999"
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-100"
                {...register('telefone')}
              />
              {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Endereço Completo *</label>
            <input 
              type="text" 
              placeholder="Ex: Rua das Flores, 123, Bairro Centro"
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-100"
              {...register('endereco')}
            />
            {errors.endereco && <p className="text-red-500 text-xs mt-1">{errors.endereco.message}</p>}
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
          form="tutor-form"
          disabled={isSubmitting}
          className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-70 transition-colors flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? 'Salvando...' : 'Salvar Tutor'}
        </button>
      </div>
    </BaseModal>
  );
}