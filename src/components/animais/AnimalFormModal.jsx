import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '../../services/api';
import { supabase } from '../../services/supabase';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { BaseModal } from '../ui/BaseModal';

const animalSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório'),
  especie: z.string().min(1, 'A espécie é obrigatória'),
  idadeMeses: z.coerce.number().optional(),
  status: z.string().min(1, 'O status é obrigatório'),
  fotoUrl: z.any().optional(),
});

export function AnimalFormModal({ isOpen, onClose, onSuccess, animalEditando }) {
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(animalSchema),
    defaultValues: { status: 'DISPONIVEL' },
  });

  useEffect(() => {
    if (animalEditando) {
      reset(animalEditando);
    } else {
      reset({ status: 'DISPONIVEL', nome: '', especie: '', idadeMeses: '' });
    }
  }, [animalEditando, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      let finalFotoUrl = animalEditando?.fotoUrl || null;

      if (data.fotoUrl && data.fotoUrl.length > 0) {
        setIsUploading(true);
        const file = data.fotoUrl[0];
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('fotos-animais')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Erro no Supabase:', uploadError);
          alert('Erro ao fazer upload da imagem. O cadastro continuará sem foto nova.');
        } else {
          const { data: publicUrlData } = supabase.storage
            .from('fotos-animais')
            .getPublicUrl(fileName);
            
          finalFotoUrl = publicUrlData.publicUrl;
        }
        setIsUploading(false);
      }

      const payload = {
        nome: data.nome,
        especie: data.especie,
        idadeMeses: data.idadeMeses,
        status: data.status,
        fotoUrl: finalFotoUrl,
      };

      if (animalEditando) {
        await api.put(`/animais/${animalEditando.id}`, payload);
      } else {
        await api.post('/animais', payload);
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar animal:', error);
      alert('Erro ao salvar os dados. Verifique sua conexão.');
      setIsUploading(false);
    }
  };

  const isProcessing = isSubmitting || isUploading;

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={animalEditando ? 'Editar Animal' : 'Cadastrar Novo Animal'}
      isProcessing={isProcessing}
    >
      <div className="p-6 overflow-y-auto">
        <form id="animal-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-6">
          
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-slate-700 mb-1">Foto do Animal</label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl h-48 flex flex-col items-center justify-center text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative overflow-hidden">
              {animalEditando?.fotoUrl && !isUploading ? (
                <img src={animalEditando.fotoUrl} alt="Atual" className="absolute inset-0 w-full h-full object-cover opacity-30" />
              ) : null}
              
              <UploadCloud className="w-8 h-8 mb-2 text-slate-400 z-10" />
              <span className="text-sm text-center px-4 z-10 font-medium text-slate-600">
                Arraste uma foto ou clique
              </span>
              <input 
                type="file" 
                accept="image/*"
                disabled={isProcessing}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-20"
                {...register('fotoUrl')}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">Permitido: JPG, PNG</p>
          </div>

          <div className="w-full md:w-2/3 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Animal *</label>
              <input 
                type="text" 
                disabled={isProcessing}
                placeholder="ex.: Bolinha"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-100"
                {...register('nome')}
              />
              {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Espécie *</label>
              <select 
                disabled={isProcessing}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white disabled:bg-slate-100"
                {...register('especie')}
              >
                <option value="">Selecione...</option>
                <option value="CACHORRO">Cachorro</option>
                <option value="GATO">Gato</option>
                <option value="OUTROS">Outros</option>
              </select>
              {errors.especie && <p className="text-red-500 text-xs mt-1">{errors.especie.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Idade aproximada (em meses)</label>
              <input 
                type="number"
                placeholder="ex.: 13"
                disabled={isProcessing}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-100"
                {...register('idadeMeses')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status Atual *</label>
              <select 
                disabled={isProcessing}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white disabled:bg-slate-100"
                {...register('status')}
              >
                <option value="DISPONIVEL">DISPONÍVEL</option>
                <option value="EM_ADOCAO">EM ADOÇÃO</option>
                <option value="ADOTADO">ADOTADO</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
            </div>
          </div>
        </form>
      </div>

      <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
        <button 
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="px-5 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button 
          type="submit"
          form="animal-form"
          disabled={isProcessing}
          className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-70 transition-colors flex items-center gap-2"
        >
          {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
          {isUploading ? 'Enviando foto...' : isSubmitting ? 'Salvando...' : 'Salvar Cadastro'}
        </button>
      </div>
    </BaseModal>
  );
}