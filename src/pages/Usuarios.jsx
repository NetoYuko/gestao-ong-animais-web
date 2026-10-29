import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Edit, Trash, KeyRound } from 'lucide-react';

import { PageHeader } from '../components/ui/PageHeader';
import { DataTable } from '../components/ui/DataTable';
import { UsuarioFormModal } from '../components/UsuarioFormModal';
import { UsuarioSenhaModal } from '../components/UsuarioSenhaModal';

export function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);

  const [isSenhaModalOpen, setIsSenhaModalOpen] = useState(false);
  const [usuarioIdParaSenha, setUsuarioIdParaSenha] = useState(null);

  const fetchUsuarios = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDelete = async (id, email) => {
    if (window.confirm(`Tem certeza que deseja excluir o acesso de ${email}?`)) {
      try {
        await api.delete(`/usuarios/${id}`);
        fetchUsuarios();
      } catch (error) {
        alert('Erro ao excluir usuário. Verifique sua conexão.');
      }
    }
  };

  const handleEditPerfil = (usuario) => {
    setUsuarioEmEdicao(usuario);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setUsuarioEmEdicao(null);
    setIsFormModalOpen(false);
  };

  const handleAlterarSenha = (id) => {
    setUsuarioIdParaSenha(id);
    setIsSenhaModalOpen(true);
  };

  const handleCloseSenhaModal = () => {
    setUsuarioIdParaSenha(null);
    setIsSenhaModalOpen(false);
  };

  const usuariosFiltrados = usuarios.filter(usuario => 
    usuario.nome.toLowerCase().includes(busca.toLowerCase()) || 
    usuario.email.toLowerCase().includes(busca.toLowerCase())
  );

  const columns = [
    { label: 'Nome' },
    { label: 'E-mail' },
    { label: 'Nível de Acesso' },
    { label: 'Ações', align: 'right' }
  ];

  const renderRow = (usuario) => (
    <tr key={usuario.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="p-4 font-medium text-slate-800">{usuario.nome}</td>
      <td className="p-4 text-slate-600">{usuario.email}</td>
      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          usuario.perfil === 'ADMIN' 
            ? 'bg-purple-100 text-purple-700' 
            : 'bg-slate-100 text-slate-700'
        }`}>
          {usuario.perfil === 'ADMIN' ? 'Administrador' : 'Voluntário'}
        </span>
      </td>
      <td className="p-4 text-right">
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => handleAlterarSenha(usuario.id)} 
            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Alterar Senha"
          >
            <KeyRound className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleEditPerfil(usuario)} 
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar Dados Básicos"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(usuario.id, usuario.email)} 
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Excluir Usuário"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 md:p-8 flex-1 flex flex-col h-full overflow-hidden">
      
      <PageHeader 
        title="Gestão de Usuários" 
        buttonText="Novo Usuário"
        onSearch={setBusca}
        onAddClick={() => setIsFormModalOpen(true)}
        showAddButton={true} 
      />

      <DataTable 
        columns={columns} 
        data={usuariosFiltrados} 
        renderRow={renderRow} 
        isLoading={isLoading} 
        emptyMessage="Nenhum usuário encontrado."
      />

      <UsuarioFormModal 
        isOpen={isFormModalOpen} 
        onClose={handleCloseFormModal} 
        onSuccess={fetchUsuarios}
        usuarioEditando={usuarioEmEdicao}
      />

      <UsuarioSenhaModal 
        isOpen={isSenhaModalOpen} 
        onClose={handleCloseSenhaModal} 
        onSuccess={fetchUsuarios}
        usuarioId={usuarioIdParaSenha}
      />
      
    </div>
  );
}