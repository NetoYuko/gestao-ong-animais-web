import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '../../services/api';
import { supabase } from '../../services/supabase';
import { UploadCloud, Loader2, Info, CheckCircle2 } from 'lucide-react';
import { BaseModal } from '../ui/BaseModal';
import toast from 'react-hot-toast';

const animalSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório'),
  especie: z.string().min(1, 'A espécie é obrigatória'),
  idadeMeses: z.coerce.number().optional(),
  fotoUrl: z.any().optional(),
});

export function AnimalFormModal({ isOpen, onClose, onSuccess, animalEditando }) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewFoto, setPreviewFoto] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(animalSchema),
  });

  const arquivoSelecionado = watch('fotoUrl');

  useEffect(() => {
    if (animalEditando) {
      reset({
        nome: animalEditando.nome,
        especie: animalEditando.especie,
        idadeMeses: animalEditando.idadeMeses,
        fotoUrl: null,
      });
      setPreviewFoto(animalEditando.fotoUrl || null);
    } else {
      reset({ nome: '', especie: '', idadeMeses: '', fotoUrl: null });
      setPreviewFoto(null);
    }
  }, [animalEditando, reset, isOpen]);

  useEffect(() => {
    if (arquivoSelecionado && arquivoSelecionado.length > 0) {
      const file = arquivoSelecionado[0];
      const objectUrl = URL.createObjectURL(file);
      setPreviewFoto(objectUrl);
      toast.success(`Imagem "${file.name}" anexada!`);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [arquivoSelecionado]);

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
          toast.error('Erro ao enviar a imagem para o Supabase.');
          setIsUploading(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from('fotos-animais')
          .getPublicUrl(fileName);
          
        finalFotoUrl = publicUrlData.publicUrl;
        setIsUploading(false);
      }

      const payload = {
        nome: data.nome,
        especie: data.especie,
        idadeMeses: data.idadeMeses,
        status: animalEditando ? animalEditando.status.replace('_', ' ') : 'DISPONIVEL',
        fotoUrl: finalFotoUrl,
      };

      if (animalEditando) {
        await api.put(`/animais/${animalEditando.id}`, payload);
        toast.success('Animal atualizado com sucesso!');
      } else {
        await api.post('/animais', payload);
        toast.success('Animal cadastrado!');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar animal:', error);
      toast.error('Erro ao salvar os dados. Verifique sua conexão.');
      setIsUploading(false);
    }
  };

  const isProcessing = isSubmitting || isUploading;
  const temNovaFoto = arquivoSelecionado && arquivoSelecionado.length > 0;

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
            <div 
              className={`border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center transition-colors cursor-pointer relative overflow-hidden ${
                temNovaFoto 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                  : 'border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-500'
              }`}
            >
              {previewFoto && !isUploading && (
                <img 
                  src={previewFoto} 
                  alt="Preview" 
                  className="absolute inset-0 w-full h-full object-cover opacity-35" 
                />
              )}
              
              {temNovaFoto ? (
                <>
                  <CheckCircle2 className="w-8 h-8 mb-2 text-emerald-600 z-10" />
                  <span className="text-xs text-center px-3 z-10 font-semibold text-emerald-800 truncate w-full">
                    {arquivoSelecionado[0]?.name}
                  </span>
                  <span className="text-[11px] text-emerald-700 z-10 mt-1">
                    Pronta para envio (clique para trocar)
                  </span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 mb-2 text-slate-400 z-10" />
                  <span className="text-sm text-center px-4 z-10 font-medium text-slate-600">
                    Arraste uma foto ou clique
                  </span>
                </>
              )}

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
                disabled={isProcessing}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-100"
                {...register('idadeMeses')}
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                Status Atual <Info className="w-4 h-4 text-slate-400" />
              </label>
              <div className="font-semibold text-slate-800">
                {animalEditando ? animalEditando.status : 'DISPONÍVEL'}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                O status é atualizado automaticamente pelos processos de adoção.
              </p>
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