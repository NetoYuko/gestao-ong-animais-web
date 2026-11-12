import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable } from '../components/ui/DataTable';
import { ProntuarioFormModal } from '../components/prontuarios/ProntuarioFormModal';
import toast from 'react-hot-toast';

export function Prontuarios() {
  const { user } = useAuth();
  const isAdmin = user?.perfil === 'ADMIN';

  const [animais, setAnimais] = useState([]);
  const [animalSelecionado, setAnimalSelecionado] = useState('');
  const [prontuarios, setProntuarios] = useState([]);
  
  const [busca, setBusca] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchAnimais() {
      try {
        const response = await api.get('/animais');
        setAnimais(response.data);
      } catch (error) {
        console.error('Erro ao buscar animais:', error);
        toast.error('Erro ao carregar a lista de animais.');
      }
    }
    fetchAnimais();
  }, []);

  useEffect(() => {
    async function fetchHistorico() {
      if (!animalSelecionado) {
        setProntuarios([]);
        return;
      }
      try {
        setIsLoading(true);
        const response = await api.get(`/prontuarios/animal/${animalSelecionado}`);
        setProntuarios(response.data);
      } catch (error) {
        console.error('Erro ao buscar prontuários:', error);
        toast.error('Erro ao carregar o histórico clínico deste animal.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistorico();
  }, [animalSelecionado]);

  const handleSuccess = (animalId) => {
    setIsModalOpen(false);
    setAnimalSelecionado(animalId);
  };

  const prontuariosFiltrados = prontuarios.filter(p => 
    p.nomeMedicamento.toLowerCase().includes(busca.toLowerCase()) ||
    p.tipo.toLowerCase().includes(busca.toLowerCase())
  );

  const tipoColors = {
    VACINA: 'bg-blue-100 text-blue-700',
    VERMIFUGO: 'bg-emerald-100 text-emerald-700',
    ANTIPULGAS: 'bg-orange-100 text-orange-700',
    ANTIBIOTICO: 'bg-red-100 text-red-700',
    OUTROS: 'bg-slate-100 text-slate-700',
  };

  const columns = [
    { label: 'Data' },
    { label: 'Medicamento' },
    { label: 'Categoria' },
    { label: 'Próxima Dose' },
    { label: 'Observações' }
  ];

  const renderRow = (prontuario) => (
    <tr key={prontuario.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="p-4 font-medium text-slate-800">
        {new Date(prontuario.dataAplicacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
      </td>
      <td className="p-4 text-slate-800">{prontuario.nomeMedicamento}</td>
      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tipoColors[prontuario.tipo] || tipoColors.OUTROS}`}>
          {prontuario.tipo}
        </span>
      </td>
      <td className="p-4 text-slate-600">
        {prontuario.dataProximaDose ? new Date(prontuario.dataProximaDose).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}
      </td>
      <td className="p-4 text-slate-500 text-sm max-w-xs truncate" title={prontuario.observacoes}>
        {prontuario.observacoes || '-'}
      </td>
    </tr>
  );

  return (
    <div className="p-4 md:p-8 flex-1 flex flex-col h-full overflow-hidden">
      
      <PageHeader 
        title="Histórico Clínico" 
        buttonText="Registrar Medicamento"
        onSearch={setBusca}
        onAddClick={() => setIsModalOpen(true)}
        showAddButton={isAdmin}
      />

      <div className="mb-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <label className="font-medium text-slate-700">Visualizar Ficha de:</label>
        <select 
          className="flex-1 max-w-sm px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          value={animalSelecionado}
          onChange={(e) => setAnimalSelecionado(e.target.value)}
        >
          <option value="">Selecione um paciente para ver o histórico...</option>
          {animais.map(animal => (
            <option key={animal.id} value={animal.id}>{animal.nome}</option>
          ))}
        </select>
      </div>

      <DataTable 
        columns={columns} 
        data={prontuariosFiltrados} 
        renderRow={renderRow} 
        isLoading={isLoading}
        emptyMessage={animalSelecionado ? "Nenhum registro médico encontrado para este animal." : "Selecione um animal acima para visualizar a ficha médica."}
      />

      <ProntuarioFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleSuccess}
        animais={animais}
      />
      
    </div>
  );
}