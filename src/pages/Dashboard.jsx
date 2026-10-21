import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PawPrint, Dog, Clock, HeartHandshake } from 'lucide-react';

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [metricas, setMetricas] = useState({
    total: 0,
    disponiveis: 0,
    emProcesso: 0,
    adotados: 0
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await api.get('/animais');
        const animais = response.data;

        setMetricas({
          total: animais.length,
          disponiveis: animais.filter(a => a.status === 'DISPONIVEL').length,
          emProcesso: animais.filter(a => a.status === 'EM_ADOCAO').length,
          adotados: animais.filter(a => a.status === 'ADOTADO').length,
        });
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  return (
    <div className="p-4 md:p-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-slate-500 font-medium animate-pulse">Carregando dados...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <PawPrint className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Total de Animais</p>
                <p className="text-2xl font-bold text-slate-800">{metricas.total}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                <Dog className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Disponíveis</p>
                <p className="text-2xl font-bold text-slate-800">{metricas.disponiveis}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Em Processo</p>
                <p className="text-2xl font-bold text-slate-800">{metricas.emProcesso}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Adotados</p>
                <p className="text-2xl font-bold text-slate-800">{metricas.adotados}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}