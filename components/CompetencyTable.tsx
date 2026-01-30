
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Competency, Lesson, Subject, Topic } from '../types';
import { Plus, X, Search, Sparkles, Wand2, Loader2, Upload, FileText, Info, Scissors, Merge, BookOpen, Check, History, MapPin, MonitorPlay } from 'lucide-react';
import LoadingOverlay from './LoadingOverlay';

// Helper component for auto-resizing textarea
const AutoResizeTextarea: React.FC<{
    value: string;
    onChange: (val: string) => void;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
}> = ({ value, onChange, className, placeholder, disabled }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full resize-none overflow-hidden transition-all ${className}`}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
        />
    );
};

interface CompetencyTableProps {
    lesson: Lesson;
    competencies: Competency[];
    currentSubject: Subject;
    filterMode: boolean;
    topicName: string;
    isAiLoading: boolean;
    canMergeNext: boolean;
    canMergePrevious: boolean;
    referenceITData?: Topic[];
    allLessonsInGrade: Lesson[];
    usageMap: Record<string, Array<{ grade: string, lessonTitle: string, isCurrent: boolean }>>;
    onUpdateTitle: (title: string) => void;
    onUpdateTopic: (topic: string) => void;
    onToggleFilter: () => void;
    onUpdateYCCD: (index: number, text: string) => void;
    onBulkUpdateYCCD: (yccd: string[]) => void;
    onAddYCCD: () => void;
    onDeleteYCCD: (index: number) => void;
    onMappingChange: (code: string, selected: boolean) => void;
    onReasonChange: (code: string, reason: string) => void;
    onSuggestAI: () => void;
    onRewriteReasonWithAI: (code: string) => Promise<void>;
    onSplitLesson: (indicesToMove: number[], newTitle: string) => void;
    onMergeNext: () => void;
    onMergePrevious: () => void;
}

const CompetencyTable: React.FC<CompetencyTableProps> = ({
    lesson,
    competencies,
    currentSubject,
    filterMode,
    topicName,
    isAiLoading,
    canMergeNext,
    canMergePrevious,
    referenceITData,
    allLessonsInGrade,
    usageMap,
    onUpdateTitle,
    onUpdateTopic,
    onToggleFilter,
    onUpdateYCCD,
    onBulkUpdateYCCD,
    onAddYCCD,
    onDeleteYCCD,
    onMappingChange,
    onReasonChange,
    onSuggestAI,
    onRewriteReasonWithAI,
    onSplitLesson,
    onMergeNext,
    onMergePrevious
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showImportModal, setShowImportModal] = useState(false);
    const [importText, setImportText] = useState('');
    const [showReferenceModal, setShowReferenceModal] = useState(false);
    const [showPrevLesson, setShowPrevLesson] = useState(false);

    const prevLesson = useMemo(() => {
        const currentIndex = allLessonsInGrade.findIndex(l => String(l.id) === String(lesson.id));
        if (currentIndex > 0) {
            return allLessonsInGrade[currentIndex - 1];
        }
        return null;
    }, [allLessonsInGrade, lesson.id]);
    
    // Calculate Current Week of the active lesson
    const currentLessonStartWeek = useMemo(() => {
        let week = 1;
        let found = false;
        
        // This simple logic mimics ScheduleTable's calculation
        // NOTE: It doesn't handle semester breaks perfectly if not strictly sequential, 
        // but assumes standard 18 week Sem 1 + 17 week Sem 2 structure
        
        let semester1Weeks = 0;

        // Count weeks for Sem 1
        for (const l of allLessonsInGrade) {
            // Need to know semester from parent, but simplified: assume order matches structure
             // We can just iterate linearly. If we cross to Sem 2, jump to week 19.
             // However, allLessonsInGrade is flat.
             // Let's iterate until we hit current lesson.
             if (String(l.id) === String(lesson.id)) {
                 found = true;
                 break;
             }
             const periods = l.periods || (l.title.toLowerCase().includes("kiểm tra") ? 1 : 2);
             week += periods;
        }

        // Logic adjustment for Semester 2 reset if user is in sem 2
        // Since we don't have semester info on individual Lesson in allLessonsInGrade (it's on Topic),
        // we might need a more robust way, but for now linear accumulation is a good approximation 
        // or we assume user curriculum is linear.
        // A better check: if week > 18, it might be sem 2, but usually Sem 2 starts at week 19.
        // For simplicity in Suggestion, we use raw linear week count.
        return week;
    }, [allLessonsInGrade, lesson.id]);

    // Calculate available IT Competencies based on schedule
    const availableITCompetencies = useMemo(() => {
        // If current subject IS IT, no need to suggest from IT
        if (currentSubject === 'Tin học' || !referenceITData) return {};

        const map: Record<string, string[]> = {}; // code -> [Lesson Titles]
        let itWeek = 1;

        referenceITData.forEach(topic => {
            // Reset to week 19 if start of Semester 2 (heuristic)
            if (topic.semester === 2 && itWeek < 19) itWeek = 19;

            topic.lessons.forEach(itLesson => {
                const duration = itLesson.periods || (itLesson.title.toLowerCase().includes("kiểm tra") ? 1 : 2);
                
                // If IT lesson starts BEFORE or AT THE SAME TIME as current lesson
                if (itWeek <= currentLessonStartWeek) {
                    if (itLesson.mappings) {
                        Object.keys(itLesson.mappings).forEach(code => {
                            if (itLesson.mappings[code].selected) {
                                if (!map[code]) map[code] = [];
                                map[code].push(`${itLesson.title} (Tuần ${itWeek})`);
                            }
                        });
                    }
                }
                itWeek += duration;
            });
        });
        return map;
    }, [referenceITData, currentSubject, currentLessonStartWeek]);

    const [showSplitModal, setShowSplitModal] = useState(false);
    const [splitTitle, setSplitTitle] = useState('');
    const [splitSelection, setSplitSelection] = useState<number[]>([]);

    const openSplitModal = () => {
        setSplitTitle(`${lesson.title} (t2)`);
        setSplitSelection([]);
        setShowSplitModal(true);
    };

    const handleSplitSubmit = () => {
        if (!splitTitle.trim()) return;
        onSplitLesson(splitSelection, splitTitle);
        setShowSplitModal(false);
    };

    const toggleSplitSelection = (index: number) => {
        setSplitSelection(prev => {
            if (prev.includes(index)) {
                return prev.filter(i => i !== index);
            } else {
                return [...prev, index];
            }
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result;
            if (typeof text === 'string') {
                setImportText(text);
            }
        };
        reader.readAsText(file);
    };

    const processImport = () => {
        const lines = importText.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        
        if (lines.length > 0) {
            onBulkUpdateYCCD(lines);
            setShowImportModal(false);
            setImportText('');
        }
    };

    const displayedCompetencies = useMemo(() => {
        let list = competencies;
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            list = list.filter(c => 
                c.code.toLowerCase().includes(lowerTerm) || 
                c.text.toLowerCase().includes(lowerTerm)
            );
        }
        if (filterMode) {
            list = list.filter(c => lesson.mappings && lesson.mappings[c.code]);
        }
        return [...list].sort((a, b) => a.code.localeCompare(b.code));
    }, [competencies, filterMode, lesson.mappings, searchTerm]);

    const isNonIT = currentSubject !== "Tin học";

    const getGradeColor = (grade: string) => {
        switch (grade) {
            case "6": return "bg-emerald-100 text-emerald-800 border-emerald-200";
            case "7": return "bg-sky-100 text-sky-800 border-sky-200";
            case "8": return "bg-orange-100 text-orange-800 border-orange-200";
            case "9": return "bg-violet-100 text-violet-800 border-violet-200";
            default: return "bg-slate-100 text-slate-800 border-slate-200";
        }
    };

    if (!lesson) return null;

    return (
        <div className="flex-grow flex flex-col bg-slate-50/50 relative overflow-hidden h-full">
            <LoadingOverlay isVisible={isAiLoading} message="AI đang phân tích và đề xuất năng lực..." />

            {/* Modals are kept the same... */}
            {showSplitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                <Scissors size={18} className="text-teal-600" /> Tách bài học
                            </h3>
                            <button onClick={() => setShowSplitModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên bài học mới</label>
                                <input 
                                    type="text" 
                                    value={splitTitle}
                                    onChange={(e) => setSplitTitle(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Chọn YCCĐ chuyển sang bài mới</label>
                                <div className="border border-slate-200 rounded-lg max-h-60 overflow-y-auto bg-slate-50 p-2 space-y-2">
                                    {lesson.yccd.map((y, idx) => (
                                        <label key={idx} className="flex items-start gap-3 p-2 bg-white rounded border border-slate-100 cursor-pointer hover:border-teal-300 transition-colors">
                                            <input 
                                                type="checkbox" 
                                                checked={splitSelection.includes(idx)}
                                                onChange={() => toggleSplitSelection(idx)}
                                                className="mt-1 accent-teal-600 w-4 h-4 shrink-0" 
                                            />
                                            <span className="text-xs text-slate-700 leading-relaxed select-none">{y}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
                            <button onClick={() => setShowSplitModal(false)} className="px-4 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-200 text-sm">Hủy bỏ</button>
                            <button onClick={handleSplitSubmit} disabled={!splitTitle.trim() || splitSelection.length === 0} className="px-4 py-2 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-md text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                <Scissors size={14} /> Xác nhận tách
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar header and filter section */}
            <div className="bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex-none z-10 sticky top-0 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-grow pr-8">
                            <div className="flex items-center gap-2 mb-1 group">
                                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-200 uppercase tracking-wide">Chủ đề</span>
                                <input 
                                    type="text" 
                                    value={topicName}
                                    onChange={(e) => onUpdateTopic(e.target.value)}
                                    className="bg-transparent border-b border-transparent hover:border-teal-500 focus:border-teal-600 focus:outline-none text-slate-500 text-xs font-medium w-full transition-colors pb-0.5" 
                                    placeholder="Nhập tên chủ đề..." 
                                />
                            </div>
                            <input 
                                type="text" 
                                value={lesson.title}
                                onChange={(e) => onUpdateTitle(e.target.value)}
                                className="text-xl font-bold text-slate-800 bg-transparent border-none focus:ring-0 p-0 w-full placeholder-slate-300 outline-none leading-tight" 
                                placeholder="Nhập tên bài học..." 
                            />
                        </div>
                        <div className="flex gap-2">
                             <button onClick={openSplitModal} className="flex items-center gap-1.5 bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 text-slate-600 px-3 py-1.5 rounded-lg shadow-sm transition-all text-xs font-bold">
                                <Scissors size={14} /> Tách tiết
                            </button>
                            {canMergePrevious && (
                                <button onClick={() => onMergePrevious()} className="flex items-center gap-1.5 bg-white border border-slate-200 hover:border-orange-500 hover:text-orange-700 text-slate-600 px-3 py-1.5 rounded-lg shadow-sm transition-all text-xs font-bold">
                                    <Merge size={14} className="rotate-180" /> Gộp trước
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 flex-grow max-w-md relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={14} />
                            <input 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm kiếm năng lực (nhập mã hoặc từ khóa)..."
                                className="w-full bg-slate-100 border border-transparent focus:bg-white focus:border-teal-500 rounded-full pl-9 pr-4 py-1.5 text-xs font-medium outline-none transition-all shadow-sm"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            {prevLesson && (
                                <button onClick={() => setShowPrevLesson(!showPrevLesson)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${showPrevLesson ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-slate-200 text-slate-600 hover:border-amber-400'}`}>
                                    <History size={14} /> Bài trước: {prevLesson.title.substring(0, 15)}...
                                </button>
                            )}
                            <button onClick={onSuggestAI} disabled={isAiLoading} className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-1.5 rounded-full shadow-md transition-all active:scale-95 disabled:opacity-50">
                                <Sparkles size={14} /> <span className="text-xs font-bold uppercase tracking-wide">Gợi ý AI</span>
                            </button>
                            <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
                                <button onClick={() => filterMode && onToggleFilter()} className={`px-3 py-1 rounded-full text-xs transition-all ${!filterMode ? 'bg-white text-teal-700 shadow-sm font-bold' : 'text-slate-500 font-medium'}`}>Tất cả</button>
                                <button onClick={() => !filterMode && onToggleFilter()} className={`px-3 py-1 rounded-full text-xs transition-all ${filterMode ? 'bg-white text-teal-700 shadow-sm font-bold' : 'text-slate-500 font-medium'}`}>Đã chọn</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto custom-scroll p-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-w-[900px]">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 z-20 bg-slate-50 shadow-[0_1px_0_#e2e8f0]">
                            <tr>
                                <th className="px-6 py-4 w-[30%] border-r border-slate-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Yêu cầu cần đạt (YCCĐ)</span>
                                        <div className="flex gap-2">
                                            <button onClick={() => setShowImportModal(true)} className="text-slate-600 hover:text-teal-700 text-[10px] bg-white px-2 py-1 rounded border border-slate-200 font-bold">Nhập</button>
                                            <button onClick={onAddYCCD} className="text-teal-600 hover:text-teal-800 text-[10px] bg-teal-50 px-2 py-1 rounded border border-teal-100 font-bold">Thêm</button>
                                        </div>
                                    </div>
                                </th>
                                <th className="px-4 py-4 w-24 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Mã</th>
                                <th className="px-4 py-4 w-[30%] text-xs font-bold text-slate-500 uppercase tracking-wider">Năng lực số</th>
                                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Minh chứng thực hiện</th>
                                <th className="px-4 py-4 w-16 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Chọn</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {displayedCompetencies.length > 0 ? (
                                displayedCompetencies.map((comp, index) => {
                                    const mapping = lesson.mappings && lesson.mappings[comp.code];
                                    const isSelected = !!mapping;
                                    const reason = mapping?.reason || '';
                                    const isSuggested = mapping?.type === 'suggested';
                                    const usages = usageMap[comp.code] || [];
                                    
                                    // Cross-reference IT data
                                    const itSuggestions = availableITCompetencies[comp.code];

                                    return (
                                        <tr key={comp.code} className={`group transition-colors ${isSelected ? 'bg-teal-50/30' : 'hover:bg-slate-50'}`}>
                                            {index === 0 && (
                                                <td rowSpan={displayedCompetencies.length} className="px-6 py-6 border-r border-slate-100 align-top bg-white">
                                                    <div className="space-y-3 sticky top-24 max-h-[70vh] overflow-y-auto custom-scroll pr-2">
                                                        {lesson.yccd.map((text, yIndex) => (
                                                            <div key={yIndex} className="bg-slate-50 border border-slate-200 rounded-lg p-3 pr-8 relative group/item hover:border-teal-200 transition-all">
                                                                <AutoResizeTextarea
                                                                    value={text}
                                                                    onChange={(val) => onUpdateYCCD(yIndex, val)}
                                                                    className="text-sm text-slate-700 outline-none w-full bg-transparent leading-relaxed"
                                                                    placeholder="Nhập nội dung YCCĐ..."
                                                                />
                                                                <button 
                                                                    onMouseDown={(e) => { e.preventDefault(); onDeleteYCCD(yIndex); }}
                                                                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all p-1"
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            )}
                                            <td className="px-4 py-4 align-top text-center pt-5">
                                                <span className={`inline-block px-2 py-1 rounded text-[10px] font-mono font-bold ${isSelected ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-500'}`}>
                                                    {comp.code}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 align-top pt-5">
                                                <div className="text-sm text-slate-700 leading-relaxed font-medium mb-3">
                                                    {comp.text}
                                                </div>

                                                {/* IT Cross-Reference Suggestion */}
                                                {itSuggestions && itSuggestions.length > 0 && (
                                                    <div className="mb-3 p-2 bg-blue-50/70 border border-blue-100 rounded-lg flex gap-2 items-start">
                                                        <MonitorPlay size={14} className="text-blue-600 mt-0.5 shrink-0" />
                                                        <div>
                                                            <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wide mb-1">Đã học ở môn Tin học:</div>
                                                            <div className="text-[11px] text-blue-800 leading-tight">
                                                                {itSuggestions.map((s, i) => (
                                                                    <div key={i} className="mb-0.5">• {s}</div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {/* Global Usage Section */}
                                                {usages.length > 0 && (
                                                    <div className="mt-4 p-2 bg-slate-50/50 rounded-lg border border-slate-100">
                                                        <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                                                            <MapPin size={10} /> Vị trí dạy học trong chương trình:
                                                        </div>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {usages.map((u, i) => (
                                                                <div 
                                                                    key={i} 
                                                                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-medium transition-all
                                                                        ${u.isCurrent ? 'bg-teal-600 text-white border-teal-700 shadow-sm' : `${getGradeColor(u.grade)}`}`}
                                                                >
                                                                    <span className="font-bold shrink-0">K{u.grade}</span>
                                                                    <span className="truncate max-w-[120px]">{u.lessonTitle}</span>
                                                                    {u.isCurrent && <Check size={8} strokeWidth={4} />}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 align-top pt-4">
                                                <div className="flex flex-col gap-2 relative">
                                                    {isSuggested && (
                                                        <div className="absolute -top-3 left-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-indigo-100 text-indigo-700 border border-indigo-200">
                                                            <Sparkles size={8} fill="currentColor" /> AI Gợi ý
                                                        </div>
                                                    )}
                                                    <AutoResizeTextarea 
                                                        className={`min-h-[80px] w-full rounded-lg px-3 py-2 text-sm transition-all outline-none border ${isSelected ? 'bg-white border-teal-200 focus:border-teal-500' : 'bg-slate-50 border-transparent text-slate-400 cursor-not-allowed'}`}
                                                        placeholder={isSelected ? "Nhập minh chứng bám sát động từ hành động của YCCĐ..." : "Chọn năng lực để nhập minh chứng..."}
                                                        value={reason}
                                                        disabled={!isSelected}
                                                        onChange={(val) => onReasonChange(comp.code, val)}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-top text-center pt-8">
                                                <input 
                                                    type="checkbox" 
                                                    className="custom-checkbox mx-auto transform scale-110"
                                                    checked={isSelected}
                                                    onChange={(e) => onMappingChange(comp.code, e.target.checked)}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-slate-400 italic">Không tìm thấy năng lực số phù hợp.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="h-12"></div>
            </div>
        </div>
    );
};

export default CompetencyTable;
