
import React from 'react';
import { Grade, Subject, ViewMode } from '../types';
import { Layers, Download, FileText, Layout, FileType, BarChart3, Presentation } from 'lucide-react';

interface HeaderProps {
    currentGrade: Grade;
    setGrade: (grade: Grade) => void;
    currentSubject: Subject;
    setSubject: (subject: Subject) => void;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    onExportWord: () => void;
    onExportJson: () => void;
    onOpenMatrix: () => void;
}

const SUBJECTS: Subject[] = [
    "Tin học", "Toán", "Ngữ văn", "KHTN", "Lịch sử và Địa lí", 
    "GDCD", "Công nghệ", "Nghệ thuật", "GDTC", "HĐTN, HN", "Khác"
];

const Header: React.FC<HeaderProps> = ({ 
    currentGrade, setGrade, 
    currentSubject, setSubject, 
    viewMode, setViewMode,
    onExportWord, onExportJson,
    onOpenMatrix
}) => {
    return (
        <header className="bg-white h-16 border-b border-slate-200 flex-none z-30 shadow-sm px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg flex items-center justify-center text-white shadow-md">
                    <Layers size={20} />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-slate-800 leading-none">EduPlan Pro</h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Teaching Management System</p>
                </div>
            </div>

            {/* View Switcher */}
            <nav className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button 
                    onClick={() => setViewMode('pl1')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'pl1' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Layout size={14} /> Phụ lục 1
                </button>
                <button 
                    onClick={() => setViewMode('pl2')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'pl2' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Presentation size={14} /> Phụ lục 2
                </button>
                <button 
                    onClick={() => setViewMode('pl3')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'pl3' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <FileType size={14} /> Phụ lục 3
                </button>
                <button 
                    onClick={() => setViewMode('pl4')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'pl4' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <FileText size={14} /> Phụ lục 4
                </button>
            </nav>

            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenMatrix}
                    className="flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 px-3 py-2 rounded-lg transition text-[10px] font-bold uppercase"
                    title="Xem bảng kiểm dò NLS toàn cấp"
                >
                    <BarChart3 size={14} /> Bảng kiểm NLS
                </button>

                <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
                    <select 
                        value={currentSubject}
                        onChange={(e) => setSubject(e.target.value as Subject)}
                        className="bg-transparent text-slate-700 font-bold text-xs focus:outline-none cursor-pointer px-2 border-r border-slate-200"
                    >
                        {SUBJECTS.map(subj => (
                            <option key={subj} value={subj}>{subj}</option>
                        ))}
                    </select>
                    <select 
                        value={currentGrade}
                        onChange={(e) => setGrade(e.target.value as Grade)}
                        className="bg-transparent text-teal-700 font-bold text-xs focus:outline-none cursor-pointer px-2"
                    >
                        <option value="6">Khối 6</option>
                        <option value="7">Khối 7</option>
                        <option value="8">Khối 8</option>
                        <option value="9">Khối 9</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={onExportWord}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow transition active:scale-95 text-[10px] font-bold uppercase"
                    >
                        <FileText size={14} /> Xuất Word
                    </button>
                    <button 
                        onClick={onExportJson}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-lg shadow transition active:scale-95 text-[10px] font-bold uppercase"
                    >
                        <Download size={14} /> JSON
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
