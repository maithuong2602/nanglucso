import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
    id: number;
    type: ToastType;
    message: string;
}

interface ToastProps {
    toasts: ToastMessage[];
    onRemove: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toasts, onRemove }) => {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div 
                    key={toast.id}
                    className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-right
                        ${toast.type === 'success' ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800' : ''}
                        ${toast.type === 'error' ? 'bg-red-50/90 border-red-200 text-red-800' : ''}
                        ${toast.type === 'info' ? 'bg-blue-50/90 border-blue-200 text-blue-800' : ''}
                    `}
                >
                    {toast.type === 'success' && <CheckCircle size={18} />}
                    {toast.type === 'error' && <AlertCircle size={18} />}
                    {toast.type === 'info' && <Info size={18} />}
                    
                    <span className="text-sm font-medium">{toast.message}</span>
                    
                    <button 
                        onClick={() => onRemove(toast.id)}
                        className="ml-2 hover:opacity-70 transition-opacity"
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Toast;