
import React from 'react';
import { CurriculumData, Lesson, Grade } from '../types';
import { Users, UserCog, MapPin, Box, Calendar } from 'lucide-react';

interface ActivityTableProps {
    fullSubjectData: CurriculumData;
    onUpdateActivity: (grade: string, lessonId: number | string, updates: Partial<Lesson>) => void;
}

const GRADES: Grade[] = ["6", "7", "8", "9"];

// Helper to check if a topic/lesson is an "Activity" (STEM, Club, etc.)
const isActivity = (topicName: string) => {
    const lower = topicName.toLowerCase();
    return lower.includes("stem") || lower.includes("clb") || lower.includes("câu lạc bộ") || lower.includes("bổ trợ") || lower.includes("trải nghiệm") || lower.includes("ngoại khóa");
};

const ActivityTable: React.FC<ActivityTableProps> = ({ fullSubjectData, onUpdateActivity }) => {
    
    const renderGradeSection = (grade: Grade, index: number) => {
        const topics = fullSubjectData[grade] || [];
        
        // Calculate timing map for all lessons in this grade
        let currentWeek = 1;
        const lessonTimings: Record<string | number, string> = {};
        
        topics.forEach(topic => {
            if (topic.semester === 2 && currentWeek < 19) currentWeek = 19;
            topic.lessons.forEach(l => {
                const p = l.periods || (l.title.toLowerCase().includes("kiểm tra") ? 1 : 2);
                const start = currentWeek;
                const end = currentWeek + p - 1;
                lessonTimings[l.id] = start === end ? `Tuần ${start}` : `Tuần ${start} - ${end}`;
                currentWeek += p;
            });
        });

        // Filter lessons that belong to "Activity" topics
        const activityLessons: { lesson: Lesson, topicName: string }[] = [];
        
        topics.forEach(topic => {
            if (isActivity(topic.topic)) {
                topic.lessons.forEach(l => activityLessons.push({ lesson: l, topicName: topic.topic }));
            }
        });

        if (activityLessons.length === 0) return null;

        return (
            <div key={grade} className="mb-8">
                <div className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">
                    {index + 1}. Khối lớp: {grade}; Số học sinh: ............
                </div>
                <table className="w-full border-collapse border border-slate-300 text-sm">
                    <thead className="bg-slate-50 text-slate-600 font-bold text-xs uppercase text-center">
                        <tr>
                            <th className="border border-slate-300 p-2 w-10">STT</th>
                            <th className="border border-slate-300 p-2 w-1/4">Chủ đề</th>
                            <th className="border border-slate-300 p-2">Yêu cầu cần đạt</th>
                            <th className="border border-slate-300 p-2 w-12">Số tiết</th>
                            <th className="border border-slate-300 p-2 w-24">Thời điểm</th>
                            <th className="border border-slate-300 p-2 w-32">Địa điểm</th>
                            <th className="border border-slate-300 p-2 w-32">Chủ trì</th>
                            <th className="border border-slate-300 p-2 w-32">Phối hợp</th>
                            <th className="border border-slate-300 p-2 w-32">Điều kiện</th>
                        </tr>
                        <tr className="bg-slate-100 text-[10px] text-slate-400">
                            <th className="border border-slate-300 p-1">(1)</th>
                            <th className="border border-slate-300 p-1">(2)</th>
                            <th className="border border-slate-300 p-1">(3)</th>
                            <th className="border border-slate-300 p-1">(4)</th>
                            <th className="border border-slate-300 p-1">(5)</th>
                            <th className="border border-slate-300 p-1">(6)</th>
                            <th className="border border-slate-300 p-1">(7)</th>
                            <th className="border border-slate-300 p-1">(8)</th>
                            <th className="border border-slate-300 p-1">(9)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activityLessons.map((item, idx) => {
                            const { lesson } = item;
                            return (
                                <tr key={lesson.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="border border-slate-300 p-2 text-center text-slate-500">{idx + 1}</td>
                                    <td className="border border-slate-300 p-2 font-medium text-slate-800">
                                        <input 
                                            className="w-full bg-transparent outline-none focus:underline"
                                            value={lesson.title}
                                            onChange={(e) => onUpdateActivity(grade, lesson.id, { title: e.target.value })}
                                        />
                                    </td>
                                    <td className="border border-slate-300 p-2 text-xs">
                                        <ul className="list-disc list-inside text-slate-600">
                                            {lesson.yccd.map((y, i) => <li key={i}>{y}</li>)}
                                        </ul>
                                    </td>
                                    <td className="border border-slate-300 p-2 text-center">
                                        <input 
                                            type="number" 
                                            className="w-full text-center bg-transparent outline-none"
                                            value={lesson.periods || 2}
                                            onChange={(e) => onUpdateActivity(grade, lesson.id, { periods: parseInt(e.target.value) || 0 })}
                                        />
                                    </td>
                                    <td className="border border-slate-300 p-2 text-center bg-slate-50/50">
                                        <div className="flex items-center gap-1 justify-center text-xs text-slate-500 font-bold">
                                            <Calendar size={12}/> {lessonTimings[lesson.id] || "..."}
                                        </div>
                                    </td>
                                    <td className="border border-slate-300 p-2">
                                        <div className="flex items-center gap-1 mb-1">
                                           <MapPin size={12} className="text-slate-400"/>
                                           <input 
                                                className="w-full text-xs bg-transparent outline-none placeholder-slate-300"
                                                placeholder="VD: Sân trường"
                                                value={lesson.location || ''}
                                                onChange={(e) => onUpdateActivity(grade, lesson.id, { location: e.target.value })}
                                            />
                                        </div>
                                    </td>
                                    <td className="border border-slate-300 p-2">
                                        <div className="flex items-center gap-1">
                                            <UserCog size={12} className="text-slate-400"/>
                                            <input 
                                                className="w-full text-xs bg-transparent outline-none placeholder-slate-300"
                                                placeholder="VD: GV Tin học"
                                                value={lesson.host || ''}
                                                onChange={(e) => onUpdateActivity(grade, lesson.id, { host: e.target.value })}
                                            />
                                        </div>
                                    </td>
                                    <td className="border border-slate-300 p-2">
                                        <div className="flex items-center gap-1">
                                            <Users size={12} className="text-slate-400"/>
                                            <input 
                                                className="w-full text-xs bg-transparent outline-none placeholder-slate-300"
                                                placeholder="VD: GVCN"
                                                value={lesson.collaborator || ''}
                                                onChange={(e) => onUpdateActivity(grade, lesson.id, { collaborator: e.target.value })}
                                            />
                                        </div>
                                    </td>
                                    <td className="border border-slate-300 p-2">
                                        <div className="flex items-center gap-1">
                                            <Box size={12} className="text-slate-400"/>
                                            <input 
                                                className="w-full text-xs bg-transparent outline-none placeholder-slate-300"
                                                placeholder="VD: Loa, máy chiếu"
                                                value={lesson.equipment || ''}
                                                onChange={(e) => onUpdateActivity(grade, lesson.id, { equipment: e.target.value })}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    const hasActivities = GRADES.some(g => {
        const topics = fullSubjectData[g] || [];
        return topics.some(t => isActivity(t.topic));
    });

    return (
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in duration-500">
            <div className="p-8 bg-white border-b border-slate-100 text-center">
                <h2 className="text-sm font-bold text-slate-500 uppercase">Phụ lục II</h2>
                <h1 className="text-xl font-bold text-slate-800 mt-1 uppercase">KHUNG KẾ HOẠCH TỔ CHỨC CÁC HOẠT ĐỘNG GIÁO DỤC CỦA TỔ CHUYÊN MÔN</h1>
                <p className="text-xs italic text-slate-500 mt-2">(Kèm theo Công văn số 5512/BGDĐT-GDTrH ngày 18 tháng 12 năm 2020 của Bộ GDĐT)</p>
            </div>
            
            <div className="p-8 overflow-x-auto">
                {hasActivities ? (
                    GRADES.map((g, i) => renderGradeSection(g, i))
                ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                        <p className="text-slate-500 font-medium">Chưa có hoạt động giáo dục nào (STEM/CLB/Trải nghiệm).</p>
                        <p className="text-xs text-slate-400 mt-2">Vui lòng sử dụng tính năng "Bảng kiểm dò NLS" để thêm các hoạt động bổ trợ vào chương trình.</p>
                    </div>
                )}
            </div>

            <div className="bg-slate-50 p-6 border-t border-slate-200 grid grid-cols-2 text-center text-sm font-bold text-slate-700">
                <div>
                    <div className="uppercase mb-16">Tổ trưởng</div>
                    <div className="font-normal italic text-slate-400">(Ký và ghi rõ họ tên)</div>
                </div>
                <div>
                    <div className="uppercase mb-16">Hiệu trưởng</div>
                    <div className="font-normal italic text-slate-400">(Ký và ghi rõ họ tên)</div>
                </div>
            </div>
        </div>
    );
};

export default ActivityTable;
