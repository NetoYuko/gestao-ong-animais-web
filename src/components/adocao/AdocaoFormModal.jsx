import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '../../services/api';
import { Loader2 } from 'lucide-react';
import { BaseModal } from '../ui/BaseModal';

const adocaoSchema = z.object({
  animalId: z.string().min(1, 'Selecione um animal'),
  tutorId: z.string().min(1, 'Selecione um tutor'),
  status: z.string().min(1, 'O status é obrigatório'),
});

export function AdocaoFormModal({ isOpen, onClose, onSuccess, adocaoEditando, animais, tutores }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(adocaoSchema),
    defaultValues: { status: 'ANALISE' }
  });

  useEffect(() => {
    if (adocaoEditando) {
      reset({
        animalId: adocaoEditando.animalId,
        tutorId: adocaoEditando.tutorId,
        status: adocaoEditando.status
      });
    } else {
      reset({ animalId: '', tutorId: '', status: 'ANALISE' });
    }
  }, [adocaoEditando, reset, isOpen]);

  const onSubmit = async (data) => {
    try {
      if (adocaoEditando) {
        await api.put(`/adocoes/${adocaoEditando.id}`, data);
      } else {
        await api.post('/adocoes', data);
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao registrar adoção:', error);
      alert('Erro ao salvar os dados. Verifique sua conexão.');
    }
  };

  const animaisDisponiveis = animais.filter(a => a.status === 'DISPONIVEL' || a.id === adocaoEditando?.animalId);

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={adocaoEditando ? 'Editar Adoção' : 'Registrar Nova Adoção'}
      isProcessing={isSubmitting}
    >
      <div className="p-6 overflow-y-auto">
        <form id="adocao-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Animal *</label>
            <select 
              disabled={isSubmitting || adocaoEditando}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-slate-100"
              {...register('animalId')}
            >
              <option value="">Selecione o Animal...</option>
              {animaisDisponiveis.map(animal => (
                <option key={animal.id} value={animal.id}>
                  {animal.nome} ({animal.especie})
                </option>
              ))}
            </select>
            {errors.animalId && <p className="text-red-500 text-xs mt-1">{errors.animalId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tutor *</label>
            <select 
              disabled={isSubmitting || adocaoEditando}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-slate-100"
              {...register('tutorId')}
            >
              <option value="">Selecione o Tutor...</option>
              {tutores.map(tutor => (
                <option key={tutor.id} value={tutor.id}>
                  {tutor.nome} - CPF: {tutor.cpf}
                </option>
              ))}
            </select>
            {errors.tutorId && <p className="text-red-500 text-xs mt-1">{errors.tutorId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status do Processo *</label>
            <select 
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-slate-100"
              {...register('status')}
            >
              <option value="ANALISE">EM ANÁLISE</option>
              <option value="PENDENTE_DOC">PENDENTE DOCUMENTAÇÃO</option>
              <option value="APROVADO">APROVADO</option>
              <option value="RECUSADO">RECUSADO</option>
            </select>
            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg mt-4">
            <p className="text-xs text-blue-700">
              <strong>Nota:</strong> Registrar o status como <strong>APROVADO</strong> alterará automaticamente o status do animal para <strong>ADOTADO</strong>.
            </p>
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
          form="adocao-form"
          disabled={isSubmitting}
          className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Registrar Adoção
        </button>
      </div>
    </BaseModal>
  );
}