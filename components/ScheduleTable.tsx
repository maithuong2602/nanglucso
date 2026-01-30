
import React, { useState, useRef, useEffect } from 'react';
import { Topic, Competency, Lesson } from '../types';
import { ChevronDown, Plus, Check, X, Laptop, MapPin, Settings2, Copy } from 'lucide-react';

interface ScheduleTableProps {
    topics: Topic[];
    competencies: Competency[];
    onUpdateLesson: (lessonId: number | string, updates: Partial<Lesson>) => void;
    onBulkUpdateField?: (field: 'equipment' | 'location', value: string) => void;
}

const EQUIPMENT_OPTIONS = ["Máy tính", "Máy chiếu"];
const LOCATION_OPTIONS = ["Phòng Tin học", "Lớp học"];

const MultiSelectDropdown: React.FC<{
    selected: string;
    options: string[];
    onUpdate: (newVal: string) => void;
    onBulkCopy?: () => void;
    placeholder: string;
    icon: React.ReactNode;
    colorClass: string;
}> = ({ selected, options, onUpdate, onBulkCopy, placeholder, icon, colorClass }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [customVal, setCustomVal] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selectedList = selected.split(',').map(t => t.trim()).filter(t => t !== "");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (option: string) => {
        const newList = selectedList.includes(option) ? selectedList.filter(t => t !== option) : [...selectedList, option];
        onUpdate(newList.join(', '));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-teal-400 transition-all min-h-[40px] shadow-sm ${isOpen ? 'ring-2 ring-teal-500/10 border-teal-500' : ''}`}
            >
                <div className="flex flex-wrap gap-1 items-center overflow-hidden">
                    <span className="text-slate-400 shrink-0">{icon}</span>
                    {selectedList.length > 0 ? (
                        selectedList.map(item => (
                            <span key={item} className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${colorClass} flex items-center gap-1`}>
                                {item}
                                <X size={8} className="cursor-pointer hover:text-red-500" onClick={(e) => { e.stopPropagation(); toggleOption(item); }} />
                            </span>
                        ))
                    ) : (
                        <span className="text-[10px] text-slate-400 italic">{placeholder}</span>
                    )}
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-teal-600' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                    <div className="max-h-48 overflow-y-auto custom-scroll">
                        {options.map(opt => (
                            <div key={opt} onClick={() => toggleOption(opt)} className="flex items-center justify-between px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                                <span className={`text-[11px] ${selectedList.includes(opt) ? 'font-bold text-teal-700' : 'text-slate-600'}`}>{opt}</span>
                                {selectedList.includes(opt) && <Check size={12} className="text-teal-600" />}
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-slate-100 p-2 flex gap-1 bg-slate-50">
                        <input 
                            type="text" value={customVal} onChange={(e) => setCustomVal(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (onUpdate([...selectedList, customVal].join(', ')), setCustomVal(''))}
                            placeholder="Khác..." className="flex-grow text-[10px] px-2 py-1.5 border rounded outline-none"
                        />
                        <button onClick={() => (onUpdate([...selectedList, customVal].join(', ')), setCustomVal(''))} className="bg-teal-600 text-white p-1.5 rounded"><Plus size={12} /></button>
                    </div>
                    {onBulkCopy && selectedList.length > 0 && (
                        <button onClick={(e) => { e.stopPropagation(); onBulkCopy(); setIsOpen(false); }} className="w-full py-2 text-[10px] font-bold uppercase text-teal-600 bg-teal-50 border-t hover:bg-teal-100 flex items-center justify-center gap-2">
                            <Copy size={12} /> Áp dụng cho cả năm
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

const ScheduleTable: React.FC<ScheduleTableProps> = ({ topics, competencies, onUpdateLesson, onBulkUpdateField }) => {
    let globalStt = 1;
    let globalWeek = 1;

    const renderRows = (semester: number) => {
        const semTopics = topics.filter(t => (t.semester || 1) === semester);
        if (semester === 2 && globalWeek < 19) globalWeek = 19;

        return semTopics.map(topic => (
            <React.Fragment key={topic.topic}>
                <tr className="bg-slate-100/50"><td colSpan={7} className="px-6 py-2 font-black text-slate-500 uppercase text-[10px] tracking-widest">{topic.topic}</td></tr>
                {topic.lessons.map(lesson => {
                    const codes = Object.keys(lesson.mappings || {}).filter(c => lesson.mappings[c].selected);
                    const periods = lesson.periods || (lesson.title.toLowerCase().includes("kiểm tra") ? 1 : 2);
                    const weekDisp = periods <= 1 ? `Tuần ${globalWeek}` : `Tuần ${globalWeek} - ${globalWeek + periods - 1}`;
                    globalWeek += periods;

                    return (
                        <tr key={lesson.id} className="hover:bg-teal-50/20 border-b border-slate-100 transition-colors">
                            <td className="px-4 py-4 text-center font-bold text-slate-400 text-xs">{globalStt++}</td>
                            <td className="px-4 py-4 font-semibold text-slate-800 text-sm">{lesson.title}</td>
                            <td className="px-2 py-4 text-center">
                                <input type="number" value={periods} onChange={(e) => onUpdateLesson(lesson.id, { periods: parseInt(e.target.value) || 1 })} className="w-12 h-8 border rounded text-center font-bold text-slate-700" />
                            </td>
                            <td className="px-4 py-4 text-center font-black text-teal-600 text-[11px] whitespace-nowrap bg-teal-50/30">{weekDisp}</td>
                            <td className="px-3 py-4"><MultiSelectDropdown selected={lesson.equipment || ""} options={EQUIPMENT_OPTIONS} onUpdate={(v) => onUpdateLesson(lesson.id, { equipment: v })} onBulkCopy={() => onBulkUpdateField?.('equipment', lesson.equipment || "")} placeholder="Thiết bị..." icon={<Laptop size={14} />} colorClass="bg-teal-50 text-teal-700 border-teal-100" /></td>
                            <td className="px-3 py-4"><MultiSelectDropdown selected={lesson.location || ""} options={LOCATION_OPTIONS} onUpdate={(v) => onUpdateLesson(lesson.id, { location: v })} onBulkCopy={() => onBulkUpdateField?.('location', lesson.location || "")} placeholder="Địa điểm..." icon={<MapPin size={14} />} colorClass="bg-indigo-50 text-indigo-700 border-indigo-100" /></td>
                            <td className="px-4 py-4">
                                <div className="flex flex-wrap gap-1">
                                    {codes.map(c => <span key={c} className="bg-white text-teal-700 px-1.5 py-0.5 rounded font-mono font-bold text-[9px] border border-teal-200">{c}</span>)}
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </React.Fragment>
        ));
    };

    return (
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in duration-500">
            <div className="p-6 bg-white border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Phụ lục 3: Kế hoạch Dạy học</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Phân phối chương trình chi tiết</p>
                </div>
                <div className="flex items-center gap-2 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100 text-[11px] font-bold text-teal-700 uppercase">
                    <Settings2 size={14} /> 1 Tiết = 1 Tuần
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-4 w-12 text-center border-b">STT</th>
                            <th className="px-6 py-4 text-left border-b">Nội dung bài dạy</th>
                            <th className="px-2 py-4 w-16 text-center border-b">Tiết</th>
                            <th className="px-4 py-4 w-32 text-center border-b bg-teal-50/50 text-teal-800 font-black">Thời điểm</th>
                            <th className="px-4 py-4 w-48 text-center border-b">Thiết bị</th>
                            <th className="px-4 py-4 w-40 text-center border-b">Địa điểm</th>
                            <th className="px-4 py-4 border-b">NLS Tích hợp</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-slate-800 text-white font-bold text-[11px] uppercase tracking-widest"><td colSpan={7} className="px-6 py-2 text-center">Học kỳ I</td></tr>
                        {renderRows(1)}
                        <tr className="bg-slate-800 text-white font-bold text-[11px] uppercase tracking-widest"><td colSpan={7} className="px-6 py-2 text-center">Học kỳ II</td></tr>
                        {renderRows(2)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScheduleTable;
