import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingOverlayProps {
    isVisible: boolean;
    message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, message = "AI đang suy nghĩ..." }) => {
    if (!isVisible) return null;

    return (
        <div className="absolute inset-0 z-40 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center transition-all duration-300">
            <div className="relative">
                <div className="absolute inset-0 bg-teal-400 rounded-full opacity-20 animate-ping"></div>
                <div className="relative bg-white p-4 rounded-full shadow-xl border border-teal-100">
                    <Sparkles className="w-8 h-8 text-teal-600 animate-pulse" />
                </div>
            </div>
            <p className="mt-4 text-sm font-bold text-teal-700 animate-pulse">{message}</p>
        </div>
    );
};

export default LoadingOverlay;