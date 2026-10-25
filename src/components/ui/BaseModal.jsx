import { X } from 'lucide-react';

export function BaseModal({ isOpen, onClose, title, children, isProcessing = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-slate-200 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button 
            onClick={onClose} 
            disabled={isProcessing}
            className="text-slate-400 hover:text-slate-600 disabled:opacity-50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {children}
        
      </div>
    </div>
  );
}