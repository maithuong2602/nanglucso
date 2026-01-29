import React from 'react';
import { Topic, Competency, Lesson } from '../types';

interface ScheduleTableProps {
    topics: Topic[];
    competencies: Competency[];
    onUpdateLesson: (lessonId: number | string, updates: Partial<Lesson>) => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ topics, competencies, onUpdateLesson }) => {
    let globalStt = 1;

    const renderSemesterSection = (semester: number, label: string) => {
        const semesterTopics = topics.filter(t => (t.semester || 1) === semester);
        if (semesterTopics.length === 0) return null;

        return (
            <React.Fragment key={semester}>
                <tr className="bg-slate-800 text-white">
                    <td className="border border-slate-700 px-3 py-3 text-center font-black">#</td>
                    <td colSpan={6} className="border border-slate-700 px-3 py-3 font-black text-center uppercase tracking-widest">{label}</td>
                </tr>
                {semesterTopics.map((topic, tIdx) => (
                    <React.Fragment key={`${semester}-${tIdx}`}>
                        <tr className="bg-slate-100">
                            <td className="border border-slate-200 px-3 py-2"></td>
                            <td colSpan={6} className="border border-slate-200 px-3 py-2 font-bold text-slate-700 uppercase">{topic.topic}</td>
                        </tr>
                        {topic.lessons.map((lesson) => {
                            const codes = Object.keys(lesson.mappings || {});
                            return (
                                <tr key={lesson.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="border border-slate-200 px-3 py-3 text-center font-bold text-slate-500">{globalStt++}</td>
                                    <td className="border border-slate-200 px-3 py-3 font-medium text-slate-800">{lesson.title}</td>
                                    <td className="border border-slate-200 px-3 py-3 text-center">1</td>
                                    <td className="border border-slate-200 px-3 py-3 text-center">-</td>
                                    <td className="border border-slate-200 px-3 py-3">
                                        <textarea 
                                            className="w-full bg-transparent border-none focus:ring-1 focus:ring-teal-500 rounded p-1 resize-none"
                                            value={lesson.equipment || 'Máy tính, máy chiếu'}
                                            onChange={(e) => onUpdateLesson(lesson.id, { equipment: e.target.value })}
                                            rows={1}
                                        />
                                    </td>
                                    <td className="border border-slate-200 px-3 py-3">
                                        <input 
                                            type="text"
                                            className="w-full bg-transparent border-none focus:ring-1 focus:ring-teal-500 rounded p-1 text-center"
                                            value={lesson.location || 'Phòng Tin học'}
                                            onChange={(e) => onUpdateLesson(lesson.id, { location: e.target.value })}
                                        />
                                    </td>
                                    <td className="border border-slate-200 px-3 py-3 bg-teal-50/20">
                                        <div className="flex flex-wrap gap-1">
                                            {codes.length > 0 ? codes.map(c => (
                                                <span key={c} className="bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-mono font-bold text-[10px]" title={competencies.find(x => x.code === c)?.text}>
                                                    {c}
                                                </span>
                                            )) : <span className="text-slate-300 italic">Chưa chọn</span>}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </React.Fragment>
                ))}
            </React.Fragment>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-white">
                <h3 className="text-xl font-black text-slate-800 uppercase text-center tracking-tight">Phụ lục 3: Kế hoạch Dạy học</h3>
                <p className="text-center text-slate-500 text-xs mt-1 font-bold">KHUNG PHÂN PHỐI CHƯƠNG TRÌNH CHI TIẾT</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                    <thead>
                        <tr className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                            <th className="border border-slate-200 px-3 py-4 w-12 text-center">STT</th>
                            <th className="border border-slate-200 px-3 py-4 w-1/4">Bài học</th>
                            <th className="border border-slate-200 px-3 py-4 w-20 text-center">Số tiết</th>
                            <th className="border border-slate-200 px-3 py-4 w-24 text-center">Thời điểm</th>
                            <th className="border border-slate-200 px-3 py-4">Thiết bị dạy học</th>
                            <th className="border border-slate-200 px-3 py-4 w-32 text-center">Địa điểm</th>
                            <th className="border border-slate-200 px-3 py-4 text-teal-800 bg-teal-50/50">NLS Tích hợp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderSemesterSection(1, "Học kỳ I")}
                        {renderSemesterSection(2, "Học kỳ II")}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScheduleTable;