export function DataTable({ 
  columns, 
  data, 
  renderRow, 
  isLoading, 
  emptyMessage = "Nenhum registro encontrado." 
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full min-w-200 text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
              {columns.map((col, index) => (
                <th 
                  key={index} 
                  className={`p-4 font-semibold ${col.align === 'right' ? 'text-right' : ''} ${col.width ? col.width : ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-slate-500">
                  Carregando...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => renderRow(item, index))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}