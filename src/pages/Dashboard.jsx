import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PawPrint, Dog, Clock, HeartHandshake, Syringe } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [metricas, setMetricas] = useState({ total: 0, disponiveis: 0, emProcesso: 0, adotados: 0 });
  const [adocoesRecentes, setAdocoesRecentes] = useState([]);
  const [proximasDoses, setProximasDoses] = useState([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [resAnimais, resAdocoes, resTutores, resProntuarios] = await Promise.all([
          api.get('/animais'),
          api.get('/adocoes').catch(() => ({ data: [] })),
          api.get('/tutores').catch(() => ({ data: [] })),
          api.get('/prontuarios').catch(() => ({ data: [] }))
        ]);

        const animais = resAnimais.data;
        const adocoes = resAdocoes.data;
        const tutores = resTutores.data;
        const prontuarios = resProntuarios.data;

        setMetricas({
          total: animais.length,
          disponiveis: animais.filter(a => a.status === 'DISPONIVEL').length,
          emProcesso: adocoes.filter(a => a.status === 'ANALISE' || a.status === 'PENDENTE_DOC').length,
          adotados: animais.filter(a => a.status === 'ADOTADO').length,
        });

        const getAnimalName = (id) => animais.find(a => a.id === id)?.nome || 'Animal';
        const getAnimalFoto = (id) => animais.find(a => a.id === id)?.fotoUrl || null;
        const getTutorName = (id) => tutores.find(t => t.id === id)?.nome || 'Tutor';

        const adocoesFormatadas = adocoes
          .sort((a, b) => new Date(b.dataInicio) - new Date(a.dataInicio))
          .slice(0, 4)
          .map(adocao => ({
            ...adocao,
            nomeAnimal: getAnimalName(adocao.animalId),
            fotoAnimal: getAnimalFoto(adocao.animalId),
            nomeTutor: getTutorName(adocao.tutorId)
          }));
        setAdocoesRecentes(adocoesFormatadas);

        const dosesFuturas = prontuarios
          .filter(p => p.dataProximaDose)
          .map(p => ({
            ...p,
            nomeAnimal: getAnimalName(p.animalId),
            dataObj: new Date(p.dataProximaDose + 'T00:00:00')
          }))
          .sort((a, b) => a.dataObj - b.dataObj)
          .slice(0, 4);

        setProximasDoses(dosesFuturas);

      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const statusAdocaoColors = {
    ANALISE: 'bg-yellow-100 text-yellow-700',
    PENDENTE_DOC: 'bg-orange-100 text-orange-700',
    APROVADO: 'bg-emerald-100 text-emerald-700',
    RECUSADO: 'bg-red-100 text-red-700',
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return '-';
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const checarStatusDose = (dataObj) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (dataObj < hoje) return <p className="text-red-500 text-xs font-medium">Atrasado</p>;
    if (dataObj.getTime() === hoje.getTime()) return <p className="text-orange-500 text-xs font-medium">Hoje</p>;
    return <p className="text-slate-500 text-xs">Agendado</p>;
  };

  return (
    <div className="p-4 md:p-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-slate-500 font-medium animate-pulse">Carregando painel de controle...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0"><PawPrint className="w-6 h-6" /></div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Total de Animais</p>
                <p className="text-2xl font-bold text-slate-800">{metricas.total}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0"><Dog className="w-6 h-6" /></div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Disponíveis</p>
                <p className="text-2xl font-bold text-slate-800">{metricas.disponiveis}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 shrink-0"><Clock className="w-6 h-6" /></div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Em Processo</p>
                <p className="text-2xl font-bold text-slate-800">{metricas.emProcesso}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0"><HeartHandshake className="w-6 h-6" /></div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Adotados</p>
                <p className="text-2xl font-bold text-slate-800">{metricas.adotados}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">Adoções Recentes</h3>
                <Link to="/adocoes" className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors">Ver todas</Link>
              </div>
              <div className="space-y-4 flex-1">
                {adocoesRecentes.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">Nenhum processo de adoção encontrado.</p>
                ) : (
                  adocoesRecentes.map(adocao => (
                    <div key={adocao.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                          {adocao.fotoAnimal ? (
                            <img src={adocao.fotoAnimal} alt={adocao.nomeAnimal} className="w-full h-full object-cover" />
                          ) : (
                            <Dog className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{adocao.nomeAnimal}</p>
                          <p className="text-slate-500 text-xs">Tutor: {adocao.nomeTutor}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusAdocaoColors[adocao.status] || 'bg-slate-100 text-slate-700'}`}>
                        {adocao.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">Próximas Doses</h3>
                <Link to="/prontuarios" className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors">Ver histórico</Link>
              </div>
              <div className="space-y-4 flex-1">
                {proximasDoses.length === 0 ? (
                   <p className="text-slate-500 text-sm text-center py-4">Nenhuma dose agendada.</p>
                ) : (
                  proximasDoses.map(dose => {
                    const isAtrasado = dose.dataObj < new Date(new Date().setHours(0,0,0,0));
                    return (
                      <div key={dose.id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isAtrasado ? 'bg-red-50/30 border-red-100' : 'hover:bg-slate-50 border-slate-100'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAtrasado ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            <Syringe className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{dose.nomeMedicamento} - {dose.nomeAnimal}</p>
                            <p className="text-slate-500 text-xs">{dose.tipo}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${isAtrasado ? 'text-red-600' : 'text-slate-700'}`}>
                            {formatarData(dose.dataProximaDose)}
                          </p>
                          {checarStatusDose(dose.dataObj)}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}