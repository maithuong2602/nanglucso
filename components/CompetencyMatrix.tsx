
import React, { useState, useMemo } from 'react';
import { CurriculumData, Competency, Grade } from '../types';
import { COMPETENCIES_TC1, COMPETENCIES_TC2 } from '../constants';
import { X, Check, Filter, Search, BarChart3, FileSpreadsheet, Monitor, AlertCircle, PlusCircle, MonitorPlay } from 'lucide-react';

interface CompetencyMatrixProps {
    isVisible: boolean;
    onClose: () => void;
    currentSubject: string;
    fullSubjectData: CurriculumData;
    itData: CurriculumData; // IT Subject data for Core Analysis
    onAddSupplementaryLesson: (grade: Grade, title: string, competencyCode: string) => void;
}

interface CoverageDetail {
    count: number;
    locations: Array<{ grade: string; lesson: string }>;
}

type FilterStatus = 'all' | 'covered' | 'missing';

const CompetencyMatrix: React.FC<CompetencyMatrixProps> = ({ 
    isVisible, onClose, currentSubject, fullSubjectData, itData, onAddSupplementaryLesson 
}) => {
    const [activeTab, setActiveTab] = useState<'TC1' | 'TC2'>('TC1');
    
    // Filter States
    const [filterCode, setFilterCode] = useState('');
    const [filterText, setFilterText] = useState('');
    const [filterGrades, setFilterGrades] = useState<Record<string, FilterStatus>>({
        '6': 'all', '7': 'all', '8': 'all', '9': 'all'
    });

    // Helper to analyze data for a specific subject
    const analyzeData = (data: CurriculumData) => {
        const stats: Record<string, Record<string, CoverageDetail>> = {}; 
        const grades = ['6', '7', '8', '9'];
        grades.forEach(grade => {
            const topics = data[grade] || [];
            topics.forEach(topic => {
                topic.lessons.forEach(lesson => {
                    if (lesson.mappings) {
                        Object.keys(lesson.mappings).forEach(code => {
                            if (lesson.mappings[code].selected) {
                                if (!stats[code]) stats[code] = {};
                                if (!stats[code][grade]) stats[code][grade] = { count: 0, locations: [] };
                                stats[code][grade].count++;
                                stats[code][grade].locations.push({
                                    grade: grade,
                                    lesson: lesson.title
                                });
                            }
                        });
                    }
                });
            });
        });
        return stats;
    };

    // 1. Analyze Both Data Sets
    const subjectCoverage = useMemo(() => analyzeData(fullSubjectData), [fullSubjectData]);
    const itCoverage = useMemo(() => analyzeData(itData), [itData]);

    if (!isVisible) return null;

    const currentList = activeTab === 'TC1' ? COMPETENCIES_TC1 : COMPETENCIES_TC2;
    const targetGrades = activeTab === 'TC1' ? ['6', '7'] : ['8', '9'];
    const isSubjectIT = currentSubject === 'Tin học';

    // 2. Filter Logic
    const filteredList = currentList.filter(comp => {
        if (filterCode && !comp.code.toLowerCase().includes(filterCode.toLowerCase())) return false;
        if (filterText && !comp.text.toLowerCase().includes(filterText.toLowerCase())) return false;

        for (const grade of targetGrades) {
            const status = filterGrades[grade];
            const isCovered = subjectCoverage[comp.code]?.[grade]?.count > 0;
            if (status === 'covered' && !isCovered) return false;
            if (status === 'missing' && isCovered) return false;
        }
        return true;
    });

    const updateGradeFilter = (grade: string, status: FilterStatus) => {
        setFilterGrades(prev => ({ ...prev, [grade]: status }));
    };

    // Stats
    const totalCompetencies = currentList.length;
    const coveredCompetencies = currentList.filter(c => {
        return targetGrades.some(g => subjectCoverage[c.code]?.[g]?.count > 0);
    }).length;
    const progressPercent = Math.round((coveredCompetencies / totalCompetencies) * 100);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-[95vw] h-[95vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-300">
                
                {/* Header */}
                <div className="bg-teal-800 text-white px-6 py-4 flex justify-between items-center flex-none shadow-md">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <FileSpreadsheet className="text-teal-200" /> 
                            PHÂN TÍCH & LẤP LỖ HỔNG NĂNG LỰC SỐ
                        </h2>
                        <p className="text-xs text-teal-100 mt-1 opacity-90">
                            Môn học: <span className="font-bold uppercase text-white bg-teal-900/50 px-1 py-0.5 rounded">{currentSubject}</span> • 
                            Đối chiếu vai trò chủ đạo của Tin học & Nhu cầu tích hợp
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-teal-900/40 px-4 py-2 rounded-lg border border-teal-600/50 flex items-center gap-3">
                            <span className="text-xs font-bold uppercase text-teal-200">Độ phủ môn học</span>
                            <div className="w-32 h-2.5 bg-teal-900 rounded-full overflow-hidden border border-teal-600">
                                <div className="h-full bg-teal-400 transition-all duration-700" style={{ width: `${progressPercent}%` }}></div>
                            </div>
                            <span className="text-sm font-bold">{coveredCompetencies}/{totalCompetencies}</span>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-teal-600 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-slate-100 border-b border-slate-300 flex px-4 pt-4 gap-2 select-none">
                    <button 
                        onClick={() => setActiveTab('TC1')}
                        className={`px-6 py-2 rounded-t-lg font-bold text-sm transition-all border-t border-x ${activeTab === 'TC1' ? 'bg-white border-slate-300 border-b-white text-teal-800 translate-y-[1px]' : 'bg-slate-200 border-transparent text-slate-500 hover:bg-slate-300'}`}
                    >
                        Khung NL 1 (Lớp 6 - 7)
                    </button>
                    <button 
                        onClick={() => setActiveTab('TC2')}
                        className={`px-6 py-2 rounded-t-lg font-bold text-sm transition-all border-t border-x ${activeTab === 'TC2' ? 'bg-white border-slate-300 border-b-white text-teal-800 translate-y-[1px]' : 'bg-slate-200 border-transparent text-slate-500 hover:bg-slate-300'}`}
                    >
                        Khung NL 2 (Lớp 8 - 9)
                    </button>
                </div>

                {/* Matrix Table */}
                <div className="flex-grow overflow-auto bg-white custom-scroll">
                    <table className="w-full border-collapse min-w-[1200px]">
                        <thead className="sticky top-0 z-20 shadow-sm">
                            <tr className="bg-slate-50 text-slate-700 text-xs uppercase font-bold tracking-wider">
                                <th className="border border-slate-300 px-3 py-3 w-28 text-center bg-slate-100">Mã NLS</th>
                                <th className="border border-slate-300 px-3 py-3 text-left bg-slate-100">Nội dung năng lực</th>
                                {targetGrades.map(g => (
                                    <th key={g} className="border border-slate-300 px-2 py-3 w-[22%] text-center bg-slate-100 p-0 align-top">
                                        <div className="bg-slate-200 py-1.5 text-slate-700 border-b border-slate-300">Lớp {g}</div>
                                        <div className="grid grid-cols-2 text-[10px]">
                                            {!isSubjectIT && <div className="py-1 border-r border-slate-300 bg-blue-50 text-blue-800" title="Vai trò chủ đạo">Nền tảng IT</div>}
                                            <div className={`py-1 ${!isSubjectIT ? 'bg-teal-50 text-teal-800' : 'col-span-2'}`} title="Tích hợp môn học">Thực hiện</div>
                                        </div>
                                    </th>
                                ))}
                                <th className="border border-slate-300 px-2 py-3 w-40 text-center bg-slate-100 text-red-700">Giải pháp / Hành động</th>
                            </tr>
                            
                            {/* Filter Row */}
                            <tr className="bg-white">
                                <th className="border border-slate-300 p-1">
                                    <div className="relative">
                                        <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"/>
                                        <input className="w-full pl-6 pr-2 py-1 text-xs border border-slate-200 rounded focus:border-teal-500 outline-none font-normal" placeholder="Lọc..." value={filterCode} onChange={e => setFilterCode(e.target.value)} />
                                    </div>
                                </th>
                                <th className="border border-slate-300 p-1">
                                    <div className="relative">
                                        <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"/>
                                        <input className="w-full pl-6 pr-2 py-1 text-xs border border-slate-200 rounded focus:border-teal-500 outline-none font-normal" placeholder="Lọc nội dung..." value={filterText} onChange={e => setFilterText(e.target.value)} />
                                    </div>
                                </th>
                                {targetGrades.map(g => (
                                    <th key={g} className="border border-slate-300 p-1 bg-slate-50/50">
                                        <select 
                                            className={`w-full py-1 text-[10px] border rounded outline-none cursor-pointer ${filterGrades[g] !== 'all' ? 'bg-teal-100 text-teal-800 font-bold' : 'bg-white'}`}
                                            value={filterGrades[g]}
                                            onChange={e => updateGradeFilter(g, e.target.value as FilterStatus)}
                                        >
                                            <option value="all">Tất cả</option>
                                            <option value="covered">Đã có</option>
                                            <option value="missing">Chưa có</option>
                                        </select>
                                    </th>
                                ))}
                                <th className="border border-slate-300 bg-slate-50"></th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-700">
                            {filteredList.map((comp, idx) => {
                                let totalSubjectCount = 0;
                                let totalITCount = 0;
                                
                                return (
                                    <tr key={comp.code} className={`hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                                        <td className="border border-slate-300 px-3 py-2 text-center font-mono text-xs font-bold text-slate-500">
                                            {comp.code}
                                        </td>
                                        <td className="border border-slate-300 px-3 py-2 leading-relaxed">
                                            {comp.text}
                                        </td>
                                        {targetGrades.map(g => {
                                            const subData = subjectCoverage[comp.code]?.[g];
                                            const itDataGrade = itCoverage[comp.code]?.[g];
                                            
                                            const subCount = subData?.count || 0;
                                            const itCount = itDataGrade?.count || 0;
                                            
                                            totalSubjectCount += subCount;
                                            totalITCount += itCount;

                                            return (
                                                <td key={g} className="border border-slate-300 p-0 align-middle h-full">
                                                    <div className="grid grid-cols-2 h-full min-h-[40px]">
                                                        {/* Col 1: IT Foundation (Only if not IT subject) */}
                                                        {!isSubjectIT && (
                                                            <div className={`flex items-center justify-center border-r border-slate-100 relative group
                                                                ${itCount > 0 ? 'bg-blue-50' : 'bg-slate-50/50 text-slate-300'}`}
                                                            >
                                                                {itCount > 0 ? (
                                                                    <Monitor size={14} className="text-blue-600" />
                                                                ) : <span className="text-[10px]">-</span>}
                                                                
                                                                {/* IT Tooltip */}
                                                                {itCount > 0 && (
                                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-50 w-48 bg-blue-900 text-white text-[10px] rounded p-2 shadow-lg">
                                                                        <div className="font-bold border-b border-blue-700 mb-1 pb-1">Đã dạy ở Tin học:</div>
                                                                        <ul className="list-disc pl-3">
                                                                            {itDataGrade.locations.map((l, i) => <li key={i}>{l.lesson}</li>)}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                        
                                                        {/* Col 2: Subject Coverage */}
                                                        <div className={`flex items-center justify-center relative group ${!isSubjectIT ? '' : 'col-span-2'} 
                                                            ${subCount > 0 ? 'bg-teal-50' : ''}`}
                                                        >
                                                            {subCount > 0 ? (
                                                                <div className="flex items-center">
                                                                    <Check size={16} className="text-teal-600 font-bold" />
                                                                    {subCount > 1 && <span className="ml-1 text-[9px] bg-teal-200 text-teal-800 px-1 rounded-full font-bold">{subCount}</span>}
                                                                </div>
                                                            ) : <span className="text-slate-300">-</span>}

                                                             {/* Subject Tooltip */}
                                                             {subCount > 0 && (
                                                                <div className="absolute bottom-full right-0 mb-1 hidden group-hover:block z-50 w-48 bg-teal-900 text-white text-[10px] rounded p-2 shadow-lg">
                                                                    <div className="font-bold border-b border-teal-700 mb-1 pb-1">Bài học môn này:</div>
                                                                    <ul className="list-disc pl-3">
                                                                        {subData.locations.map((l, i) => <li key={i}>{l.lesson}</li>)}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                        
                                        {/* Action / Solution Column */}
                                        <td className="border border-slate-300 px-2 py-2 text-center">
                                            {totalSubjectCount === 0 ? (
                                                <div className="flex flex-col items-center gap-1.5">
                                                    {(!isSubjectIT && totalITCount > 0) ? (
                                                        <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 border border-blue-200 rounded font-bold w-full">
                                                            Nên Tích hợp
                                                        </span>
                                                    ) : (
                                                        <div className="w-full flex flex-col gap-1">
                                                            <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 border border-red-200 rounded font-bold flex items-center justify-center gap-1">
                                                                <AlertCircle size={10} /> Thiếu hụt
                                                            </span>
                                                            <button 
                                                                onClick={() => {
                                                                    const gradeToFix = targetGrades.find(g => subjectCoverage[comp.code]?.[g]?.count === 0) || targetGrades[0];
                                                                    const title = `CLB Tin học/STEM: ${comp.text.substring(0, 30)}...`;
                                                                    onAddSupplementaryLesson(gradeToFix as Grade, title, comp.code);
                                                                }}
                                                                className="flex items-center justify-center gap-1 text-[9px] bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 transition shadow-sm font-bold"
                                                            >
                                                                <PlusCircle size={10} /> Thêm STEM/CLB
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-teal-600 font-bold flex items-center justify-center gap-1">
                                                    <Check size={12} /> Đã phủ {Math.round((totalSubjectCount / targetGrades.length) * 100) > 100 ? 100 : Math.round((totalSubjectCount / targetGrades.length) * 100)}%
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                {/* Footer Legend */}
                <div className="bg-slate-50 border-t border-slate-300 p-3 flex flex-wrap gap-6 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                        <Monitor size={14} className="text-blue-600" /> 
                        <span>: Nền tảng (Môn Tin học đã dạy)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Check size={14} className="text-teal-600" /> 
                        <span>: Thực hiện (Môn hiện tại đã tích hợp)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[10px] font-bold border border-red-200">Thiếu hụt</span> 
                        <span>: Cần bổ sung hoạt động trải nghiệm/STEM</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-200">Nên Tích hợp</span> 
                        <span>: HS đã có kiến thức nền, môn này nên khai thác</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompetencyMatrix;
