import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Edit, Trash } from 'lucide-react';

import { PageHeader } from '../components/ui/PageHeader';
import { DataTable } from '../components/ui/DataTable';
import { AnimalFormModal } from '../components/animais/AnimalFormModal';

export function Animais() {
  const { user } = useAuth();
  const isAdmin = user?.perfil === 'ADMIN';

  const [animais, setAnimais] = useState([]);
  const [busca, setBusca] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animalEmEdicao, setAnimalEmEdicao] = useState(null);

  const fetchAnimais = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/animais');
      setAnimais(response.data);
    } catch (error) {
      console.error('Erro ao buscar animais:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimais();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir permanentemente este animal?')) {
      try {
        await api.delete(`/animais/${id}`);
        fetchAnimais();
      } catch (error) {
        alert('Erro ao excluir. O animal pode estar vinculado a um processo.');
      }
    }
  };

  const handleEdit = (animal) => {
    setAnimalEmEdicao(animal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setAnimalEmEdicao(null);
    setIsModalOpen(false);
  };

  const animaisFiltrados = animais.filter(animal => 
    animal.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const statusColors = {
    DISPONIVEL: 'bg-emerald-100 text-emerald-700',
    EM_ADOCAO: 'bg-yellow-100 text-yellow-700',
    ADOTADO: 'bg-blue-100 text-blue-700',
  };

  const columns = [
    { label: 'Foto', width: 'w-16' },
    { label: 'Nome' },
    { label: 'Espécie' },
    { label: 'Idade' },
    { label: 'Status' },
    ...(isAdmin ? [{ label: 'Ações', align: 'right' }] : [])
  ];

  const renderRow = (animal) => (
    <tr key={animal.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="p-4">
        <div className="w-12 h-12 bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
          {animal.fotoUrl ? (
            <img src={animal.fotoUrl} alt={animal.nome} className="w-full h-full object-cover" />
          ) : (
            <span className="text-slate-400 text-xs">Sem foto</span>
          )}
        </div>
      </td>
      <td className="p-4 font-medium text-slate-800">{animal.nome}</td>
      <td className="p-4 text-slate-600">{animal.especie}</td>
      <td className="p-4 text-slate-600">{animal.idadeMeses ? `${animal.idadeMeses} meses` : 'N/I'}</td>
      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[animal.status] || 'bg-slate-100 text-slate-700'}`}>
          {animal.status.replace('_', ' ')}
        </span>
      </td>
      {isAdmin && (
        <td className="p-4 text-right">
          <div className="flex justify-end gap-2">
            <button onClick={() => handleEdit(animal)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => handleDelete(animal.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </td>
      )}
    </tr>
  );

  return (
    <div className="p-4 md:p-8 flex-1 flex flex-col h-full overflow-hidden">
      
      <PageHeader 
        title="Animais Resgatados" 
        buttonText="Cadastrar Animal"
        onSearch={setBusca}
        onAddClick={() => setIsModalOpen(true)}
        showAddButton={isAdmin}
      />

      <DataTable 
        columns={columns} 
        data={animaisFiltrados} 
        renderRow={renderRow} 
        isLoading={isLoading} 
      />

      <AnimalFormModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSuccess={fetchAnimais}
        animalEditando={animalEmEdicao}
      />
      
    </div>
  );
}