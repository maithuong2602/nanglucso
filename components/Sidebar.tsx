
import React, { useState, useMemo } from 'react';
import { Topic } from '../types';
import { FolderPlus, Plus, ChevronUp, ChevronDown, ArrowUp, ArrowDown, Trash2, CheckCircle, GripVertical, CalendarDays } from 'lucide-react';

interface SidebarProps {
    topics: Topic[];
    currentLessonId: number | string | null;
    onSelectLesson: (id: number | string) => void;
    onAddLesson: () => void;
    onAddTopic: () => void;
    onDeleteLesson: (id: number | string) => void;
    onMoveLesson: (id: number | string, direction: -1 | 1) => void;
    onMoveTopic: (topicIndex: number, direction: -1 | 1) => void;
    onReorderLesson: (sourceLessonId: string | number, targetTopicIndex: number, targetLessonIndex: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    topics, 
    currentLessonId, 
    onSelectLesson, 
    onAddLesson, 
    onAddTopic, 
    onDeleteLesson, 
    onMoveLesson,
    onMoveTopic,
    onReorderLesson
}) => {
    const [draggedLessonId, setDraggedLessonId] = useState<string | number | null>(null);
    const [dragOverTarget, setDragOverTarget] = useState<{ type: 'lesson' | 'topic', id: string | number | number, position: 'top' | 'bottom' | 'inside' } | null>(null);

    const totalLessons = topics.reduce((acc, topic) => acc + topic.lessons.length, 0);

    // DND Handlers
    const handleDragStart = (e: React.DragEvent, lessonId: string | number) => {
        setDraggedLessonId(lessonId);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(lessonId));
    };

    const handleDragOverLesson = (e: React.DragEvent, lessonId: string | number) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (String(lessonId) === String(draggedLessonId)) return;

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        const position = e.clientY < midY ? 'top' : 'bottom';

        setDragOverTarget({ type: 'lesson', id: lessonId, position });
    };

    const handleDragOverTopic = (e: React.DragEvent, topicIndex: number) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverTarget({ type: 'topic', id: topicIndex, position: 'inside' });
    };

    const handleDrop = (e: React.DragEvent, targetTopicIndex: number, targetLessonIndex?: number) => {
        e.preventDefault();
        const sourceId = draggedLessonId;
        
        if (sourceId === null) return;
        
        if (targetLessonIndex === undefined) {
            onReorderLesson(sourceId, targetTopicIndex, 0);
        } else {
            const insertIndex = dragOverTarget?.position === 'top' ? targetLessonIndex : targetLessonIndex + 1;
            onReorderLesson(sourceId, targetTopicIndex, insertIndex);
        }

        setDraggedLessonId(null);
        setDragOverTarget(null);
    };

    const handleDragEnd = () => {
        setDraggedLessonId(null);
        setDragOverTarget(null);
    };

    // Helper to render semester sections
    const renderSemester = (semester: number, label: string) => {
        const semesterTopics = topics.filter(t => (t.semester || 1) === semester);
        
        return (
            <div className="mb-4">
                <div className="px-4 py-3 bg-slate-50 border-y border-slate-100 flex items-center gap-2">
                    <CalendarDays size={14} className="text-teal-600" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</h3>
                </div>
                
                {semesterTopics.length === 0 && (
                    <div className="p-8 text-center text-slate-300 text-[10px] italic">
                        Kéo chủ đề hoặc bài học vào đây
                    </div>
                )}

                {topics.map((topic, originalIdx) => {
                    // Only render if it belongs to this semester
                    if ((topic.semester || 1) !== semester) return null;

                    const isTopicDragOver = dragOverTarget?.type === 'topic' && dragOverTarget.id === originalIdx;

                    return (
                        <div key={originalIdx} className="animate-in fade-in slide-in-from-left-2 duration-300">
                            <div 
                                onDragOver={(e) => handleDragOverTopic(e, originalIdx)}
                                onDrop={(e) => handleDrop(e, originalIdx)}
                                className={`px-4 py-2 flex justify-between items-center group cursor-pointer transition-colors border-t border-transparent
                                    ${isTopicDragOver ? 'bg-teal-50 border-t-teal-500' : 'hover:bg-slate-100'}`}
                            >
                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight truncate pr-2 pointer-events-none" title={topic.topic}>
                                    {topic.topic}
                                </span>
                                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button type="button" onClick={() => onMoveTopic(originalIdx, -1)} className="text-slate-400 hover:text-teal-700 hover:bg-slate-200 p-1 rounded" title="Lên">
                                        <ChevronUp size={12} />
                                    </button>
                                    <button type="button" onClick={() => onMoveTopic(originalIdx, 1)} className="text-slate-400 hover:text-teal-700 hover:bg-slate-200 p-1 rounded" title="Xuống">
                                        <ChevronDown size={12} />
                                    </button>
                                </div>
                            </div>
                            
                            {topic.lessons.length === 0 && (
                                <div 
                                    onDragOver={(e) => {e.preventDefault(); setDragOverTarget({type: 'topic', id: originalIdx, position: 'inside'})}}
                                    onDrop={(e) => handleDrop(e, originalIdx)}
                                    className={`h-8 mx-4 my-1 border-2 border-dashed rounded flex items-center justify-center text-[10px] text-slate-300
                                        ${isTopicDragOver ? 'border-teal-300 bg-teal-50' : 'border-slate-100'}`}
                                >
                                    Trống - Thả bài vào đây
                                </div>
                            )}

                            {topic.lessons.map((lesson, lessonIndex) => {
                                const isActive = String(lesson.id) === String(currentLessonId);
                                const hasEvidence = lesson.mappings && Object.keys(lesson.mappings).length > 0;
                                const isDragging = String(lesson.id) === String(draggedLessonId);
                                const isOver = dragOverTarget?.type === 'lesson' && String(dragOverTarget.id) === String(lesson.id);
                                const dropPos = isOver ? dragOverTarget?.position : null;

                                return (
                                    <div 
                                        key={lesson.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, lesson.id)}
                                        onDragOver={(e) => handleDragOverLesson(e, lesson.id)}
                                        onDragEnd={handleDragEnd}
                                        onDrop={(e) => handleDrop(e, originalIdx, lessonIndex)}
                                        className={`relative transition-all duration-200 border-l-[3px] flex group
                                            ${isActive ? 'bg-teal-50 border-l-teal-600 shadow-[inset_4px_0_0_#0d9488]' : 'border-l-transparent hover:bg-slate-50'}
                                            ${isDragging ? 'opacity-40 bg-slate-100 scale-95' : 'opacity-100'}
                                            ${dropPos === 'top' ? 'border-t-2 border-t-teal-500' : ''}
                                            ${dropPos === 'bottom' ? 'border-b-2 border-b-teal-500' : ''}
                                        `}
                                    >
                                        <div className="flex items-center pl-1 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 group-hover:text-slate-400">
                                            <GripVertical size={14} />
                                        </div>

                                        <div 
                                            onClick={() => onSelectLesson(lesson.id)}
                                            className="flex-grow py-2.5 pl-1 pr-2 cursor-pointer overflow-hidden"
                                        >
                                            <div className={`text-sm leading-tight mb-0.5 truncate select-none transition-colors ${isActive ? 'text-teal-800 font-bold' : 'text-slate-600'}`}>
                                                {lesson.title}
                                            </div>
                                            {hasEvidence && (
                                                <div className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-full bg-teal-100 border border-teal-200">
                                                    <CheckCircle size={10} className="text-teal-600" />
                                                    <span className="text-[8px] font-black text-teal-700 uppercase tracking-tighter whitespace-nowrap">Đã tích hợp</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className={`flex flex-col gap-1 items-end justify-start py-2 pr-2 shrink-0 z-10 transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                            <div className="flex gap-0.5">
                                                <button 
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); onMoveLesson(lesson.id, -1); }}
                                                    className="text-slate-400 hover:text-teal-600 hover:bg-slate-200 p-1 rounded"
                                                    title="Lên"
                                                >
                                                    <ArrowUp size={12} />
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); onMoveLesson(lesson.id, 1); }}
                                                    className="text-slate-400 hover:text-teal-600 hover:bg-slate-200 p-1 rounded"
                                                    title="Xuống"
                                                >
                                                    <ArrowDown size={12} />
                                                </button>
                                            </div>
                                            
                                            <button 
                                                type="button"
                                                onClick={(e) => { 
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    onDeleteLesson(lesson.id); 
                                                }}
                                                className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded mt-1"
                                                title="Xóa bài"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col z-20 shadow-[8px_0_32px_rgba(0,0,0,0.03)] h-full transition-all duration-300">
            <div className="p-5 border-b border-slate-100 bg-white flex justify-between items-center">
                <div>
                    <h2 className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Danh mục bài học</h2>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-bold">TỔNG CỘNG: {totalLessons} TIẾT</div>
                </div>
                <div className="flex gap-1.5">
                    <button 
                        type="button"
                        onClick={onAddTopic}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:text-teal-600 hover:border-teal-500 hover:shadow-sm transition-all" 
                        title="Thêm Chủ đề"
                    >
                        <FolderPlus size={16} />
                    </button>
                    <button 
                        type="button"
                        onClick={onAddLesson}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-teal-600 text-white hover:bg-teal-700 shadow-md transition-all active:scale-95" 
                        title="Thêm Bài học"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>
            
            <div className="flex-grow overflow-y-auto custom-scroll pb-20 select-none">
                {renderSemester(1, "Học kỳ I")}
                {renderSemester(2, "Học kỳ II")}
            </div>
        </aside>
    );
};

export default Sidebar;
