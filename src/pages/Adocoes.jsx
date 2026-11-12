import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Edit } from 'lucide-react';
import toast from 'react-hot-toast';

import { PageHeader } from '../components/ui/PageHeader';
import { DataTable } from '../components/ui/DataTable';
import { AdocaoFormModal } from '../components/adocao/AdocaoFormModal';

export function Adocoes() {
  const { user } = useAuth();
  const isAdmin = user?.perfil === 'ADMIN';

  const [adocoes, setAdocoes] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [tutores, setTutores] = useState([]);
  
  const [busca, setBusca] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adocaoEmEdicao, setAdocaoEmEdicao] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [resAdocoes, resAnimais, resTutores] = await Promise.all([
        api.get('/adocoes'),
        api.get('/animais'),
        api.get('/tutores')
      ]);
      
      setAdocoes(resAdocoes.data);
      setAnimais(resAnimais.data);
      setTutores(resTutores.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast.error('Erro ao carregar os processos de adoção.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (adocao) => {
    setAdocaoEmEdicao(adocao);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setAdocaoEmEdicao(null);
    setIsModalOpen(false);
  };

  const getAnimalName = (id) => animais.find(a => a.id === id)?.nome || 'Animal Desconhecido';
  const getTutorName = (id) => tutores.find(t => t.id === id)?.nome || 'Tutor Desconhecido';

  const adocoesFiltradas = adocoes.filter(adocao => {
    const nomeAnimal = getAnimalName(adocao.animalId).toLowerCase();
    const nomeTutor = getTutorName(adocao.tutorId).toLowerCase();
    const termo = busca.toLowerCase();
    return nomeAnimal.includes(termo) || nomeTutor.includes(termo);
  });

  const statusColors = {
    ANALISE: 'bg-yellow-100 text-yellow-700',
    PENDENTE_DOC: 'bg-orange-100 text-orange-700',
    APROVADO: 'bg-emerald-100 text-emerald-700',
    RECUSADO: 'bg-red-100 text-red-700',
  };

  const columns = [
    { label: 'Animal' },
    { label: 'Tutor' },
    { label: 'Status' },
    { label: 'Data de Início' },
    { label: 'Data de Conclusão' },
    ...(isAdmin ? [{ label: 'Ações', align: 'right' }] : [])
  ];

  const formatarData = (dataStr) => {
    if (!dataStr) return '-';
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const renderRow = (adocao) => (
    <tr key={adocao.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="p-4 font-medium text-slate-800">{getAnimalName(adocao.animalId)}</td>
      <td className="p-4 text-slate-600">{getTutorName(adocao.tutorId)}</td>
      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[adocao.status] || 'bg-slate-100 text-slate-700'}`}>
          {adocao.status.replace('_', ' ')}
        </span>
      </td>
      <td className="p-4 text-slate-600">{formatarData(adocao.dataInicio)}</td>
      <td className="p-4 text-slate-600">{formatarData(adocao.dataConclusao)}</td>
      
      {isAdmin && (
        <td className="p-4 text-right">
          <button onClick={() => handleEdit(adocao)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
             <Edit className="w-4 h-4" />
          </button>
        </td>
      )}
    </tr>
  );

  return (
    <div className="p-4 md:p-8 flex-1 flex flex-col h-full overflow-hidden">
      
      <PageHeader 
        title="Processos de Adoção" 
        buttonText="Nova Adoção"
        onSearch={setBusca}
        onAddClick={() => setIsModalOpen(true)}
        showAddButton={isAdmin}
      />

      <DataTable 
        columns={columns} 
        data={adocoesFiltradas} 
        renderRow={renderRow} 
        isLoading={isLoading} 
        emptyMessage="Nenhum processo de adoção encontrado."
      />

      <AdocaoFormModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSuccess={fetchData}
        adocaoEditando={adocaoEmEdicao}
        animais={animais}
        tutores={tutores}
      />
      
    </div>
  );
}