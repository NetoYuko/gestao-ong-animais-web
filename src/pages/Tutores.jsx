import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Edit, Trash } from 'lucide-react';

import { PageHeader } from '../components/ui/PageHeader';
import { DataTable } from '../components/ui/DataTable';
import { TutorFormModal } from '../components/tutores/TutorFormModal';

export function Tutores() {
  const { user } = useAuth();
  const isAdmin = user?.perfil === 'ADMIN';

  const [tutores, setTutores] = useState([]);
  const [busca, setBusca] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tutorEmEdicao, setTutorEmEdicao] = useState(null);

  const fetchTutores = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/tutores');
      setTutores(response.data);
    } catch (error) {
      console.error('Erro ao buscar tutores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTutores();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este tutor? Isso só será possível se não houver adoções vinculadas a ele.')) {
      try {
        await api.delete(`/tutores/${id}`);
        fetchTutores();
      } catch (error) {
        alert('Erro ao excluir. Este tutor provavelmente possui processos de adoção vinculados.');
      }
    }
  };

  const handleEdit = (tutor) => {
    setTutorEmEdicao(tutor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setTutorEmEdicao(null);
    setIsModalOpen(false);
  };

  const tutoresFiltrados = tutores.filter(tutor => 
    tutor.nome.toLowerCase().includes(busca.toLowerCase()) || 
    tutor.cpf.includes(busca)
  );

  const columns = [
    { label: 'Nome' },
    { label: 'CPF' },
    { label: 'Telefone' },
    { label: 'Endereço' },
    ...(isAdmin ? [{ label: 'Ações', align: 'right' }] : [])
  ];

  const renderRow = (tutor) => (
    <tr key={tutor.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="p-4 font-medium text-slate-800">{tutor.nome}</td>
      <td className="p-4 text-slate-600">{tutor.cpf}</td>
      <td className="p-4 text-slate-600">{tutor.telefone}</td>
      <td className="p-4 text-slate-600 truncate max-w-50" title={tutor.endereco}>
        {tutor.endereco}
      </td>
      {isAdmin && (
        <td className="p-4 text-right">
          <div className="flex justify-end gap-2">
            <button onClick={() => handleEdit(tutor)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => handleDelete(tutor.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
        title="Tutores Cadastrados" 
        buttonText="Cadastrar Tutor"
        onSearch={setBusca}
        onAddClick={() => setIsModalOpen(true)}
        showAddButton={isAdmin}
      />

      <DataTable 
        columns={columns} 
        data={tutoresFiltrados} 
        renderRow={renderRow} 
        isLoading={isLoading} 
        emptyMessage="Nenhum tutor encontrado."
      />

      <TutorFormModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSuccess={fetchTutores}
        tutorEditando={tutorEmEdicao}
      />
      
    </div>
  );
}