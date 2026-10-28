import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '../services/api';
import { BaseModal } from './ui/BaseModal';
import { Loader2 } from 'lucide-react';

const prontuarioSchema = z.object({
  animalId: z.string().min(1, 'Selecione o animal'),
  nomeMedicamento: z.string().min(3, 'O nome do medicamento é obrigatório'),
  tipo: z.string().min(1, 'Selecione o tipo'),
  dataAplicacao: z.string().min(1, 'A data de aplicação é obrigatória'),
  dataProximaDose: z.string().optional(),
  observacoes: z.string().optional(),
});

export function ProntuarioFormModal({ isOpen, onClose, onSuccess, animais }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(prontuarioSchema),
    defaultValues: {
      animalId: '',
      nomeMedicamento: '',
      tipo: '',
      dataAplicacao: new Date().toISOString().split('T')[0],
      dataProximaDose: '',
      observacoes: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        dataProximaDose: data.dataProximaDose ? data.dataProximaDose : null
      };

      await api.post('/prontuarios', payload);
      reset();
      onSuccess(data.animalId);
    } catch (error) {
      console.error("Erro ao registrar prontuário:", error);
      alert("Ocorreu um erro ao salvar o registro médico.");
    }
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={() => { reset(); onClose(); }} 
      title="Registrar Aplicação Médica"
      isProcessing={isSubmitting}
    >
      <div className="p-6 overflow-y-auto">
        <form id="prontuario-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Animal *</label>
              <select 
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                {...register('animalId')}
              >
                <option value="">Selecione o paciente...</option>
                {animais.map(animal => (
                  <option key={animal.id} value={animal.id}>{animal.nome} ({animal.especie})</option>
                ))}
              </select>
              {errors.animalId && <p className="text-red-500 text-xs mt-1">{errors.animalId.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Medicamento *</label>
              <input 
                type="text" 
                placeholder="Ex: Bravecto, V10..."
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                {...register('nomeMedicamento')}
              />
              {errors.nomeMedicamento && <p className="text-red-500 text-xs mt-1">{errors.nomeMedicamento.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoria *</label>
              <select 
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                {...register('tipo')}
              >
                <option value="">Selecione...</option>
                <option value="VACINA">VACINA</option>
                <option value="VERMIFUGO">VERMÍFUGO</option>
                <option value="ANTIPULGAS">ANTIPULGAS</option>
                <option value="ANTIBIOTICO">ANTIBIÓTICO</option>
                <option value="OUTROS">OUTROS</option>
              </select>
              {errors.tipo && <p className="text-red-500 text-xs mt-1">{errors.tipo.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data da Aplicação *</label>
              <input 
                type="date" 
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                {...register('dataAplicacao')}
              />
              {errors.dataAplicacao && <p className="text-red-500 text-xs mt-1">{errors.dataAplicacao.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Próxima Dose</label>
              <input 
                type="date" 
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                {...register('dataProximaDose')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Observações Clínicas</label>
            <textarea 
              rows="3"
              disabled={isSubmitting}
              placeholder="Reações adversas, dosagem aplicada, via de administração..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              {...register('observacoes')}
            ></textarea>
          </div>

        </form>
      </div>

      <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
        <button 
          type="button"
          onClick={() => { reset(); onClose(); }}
          disabled={isSubmitting}
          className="px-5 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium transition-colors"
        >
          Cancelar
        </button>
        <button 
          type="submit"
          form="prontuario-form"
          disabled={isSubmitting}
          className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Registrar no Histórico
        </button>
      </div>
    </BaseModal>
  );
}