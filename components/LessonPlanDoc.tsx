import React from 'react';
import { Lesson, Competency } from '../types';
import { Info, Target, Laptop, PlayCircle } from 'lucide-react';

interface LessonPlanDocProps {
    lesson: Lesson;
    competencies: Competency[];
}

const LessonPlanDoc: React.FC<LessonPlanDocProps> = ({ lesson, competencies }) => {
    const codes = Object.keys(lesson.mappings || {});

    return (
        <div className="max-w-[800px] mx-auto bg-white shadow-2xl border border-slate-200 p-12 min-h-[1100px] font-serif text-[#333]">
            {/* Header info */}
            <div className="mb-10 flex justify-between text-xs font-sans">
                <div className="space-y-1">
                    <p><b>Trường:</b> ........................................</p>
                    <p><b>Tổ:</b> ................................................</p>
                </div>
                <div className="text-right space-y-1">
                    <p><b>Giáo viên:</b> ........................................</p>
                    <p><b>Ngày soạn:</b> {new Date().toLocaleDateString('vi-VN')}</p>
                </div>
            </div>

            <div className="text-center mb-10">
                <h2 className="text-xl font-bold uppercase font-sans">Kế hoạch bài dạy</h2>
                <h3 className="text-lg font-bold mt-2 font-sans">Tên bài dạy: {lesson.title}</h3>
                <p className="italic text-sm mt-1 font-sans">Thời gian thực hiện: (1 tiết)</p>
            </div>

            {/* Section I */}
            <section className="mb-8">
                <h4 className="flex items-center gap-2 text-md font-bold uppercase mb-3 font-sans border-b border-slate-100 pb-1">
                    <Target size={18} className="text-teal-600" /> I. Mục tiêu
                </h4>
                <div className="space-y-3 pl-6">
                    <div>
                        <p className="font-bold text-sm font-sans">1. Kiến thức & Yêu cầu cần đạt:</p>
                        <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-sm leading-relaxed">
                            {lesson.yccd.map((y, i) => (
                                <li key={i}>{y}</li>
                            ))}
                        </ul>
                    </div>
                    {codes.length > 0 && (
                        <div className="bg-teal-50 border border-teal-100 p-4 rounded-lg">
                            <p className="font-bold text-teal-800 text-xs uppercase mb-2 flex items-center gap-2">
                                <Info size={14} /> Phát triển năng lực số (Tích hợp):
                            </p>
                            <ul className="space-y-2 text-sm italic">
                                {codes.map(c => (
                                    <li key={c} className="text-teal-900">
                                        <b>{c}:</b> {competencies.find(x => x.code === c)?.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </section>

            {/* Section II */}
            <section className="mb-8">
                <h4 className="flex items-center gap-2 text-md font-bold uppercase mb-3 font-sans border-b border-slate-100 pb-1">
                    <Laptop size={18} className="text-teal-600" /> II. Thiết bị dạy học và học liệu
                </h4>
                <p className="pl-6 text-sm leading-relaxed">
                    - {lesson.equipment || 'Máy tính, máy chiếu, bảng, phấn.'}<br/>
                    - Học liệu: Sách giáo khoa, phiếu học tập, dữ liệu mẫu trên máy tính.
                </p>
            </section>

            {/* Section III */}
            <section className="mb-8">
                <h4 className="flex items-center gap-2 text-md font-bold uppercase mb-3 font-sans border-b border-slate-100 pb-1">
                    <PlayCircle size={18} className="text-teal-600" /> III. Tiến trình dạy học
                </h4>
                
                <div className="space-y-8 pl-6">
                    {/* Activity 1 */}
                    <div className="relative">
                        <div className="absolute left-[-20px] top-0 bottom-0 w-px bg-slate-200"></div>
                        <h5 className="font-bold text-sm text-teal-700 mb-2 font-sans">Hoạt động 1: Mở đầu / Khởi động (5-7 phút)</h5>
                        <p className="text-sm leading-relaxed">
                            Giáo viên tổ chức hoạt động nhằm tạo hứng thú và gợi mở vấn đề liên quan đến bài học. Học sinh tham gia trả lời các câu hỏi tình huống thực tế.
                        </p>
                    </div>

                    {/* Integrated NLS Blocks */}
                    {codes.map((code, idx) => (
                        <div key={code} className="bg-slate-50 border-l-4 border-teal-500 p-5 rounded-r-lg shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className="bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Tích hợp NLS: {code}</span>
                            </div>
                            <p className="text-sm leading-relaxed text-slate-700 italic">
                                {lesson.mappings[code].reason || "Giáo viên hướng dẫn học sinh vận dụng năng lực số này để thực hiện nhiệm vụ bài học..."}
                            </p>
                        </div>
                    ))}

                    {/* Activity 2 */}
                    <div className="relative">
                        <div className="absolute left-[-20px] top-0 bottom-0 w-px bg-slate-200"></div>
                        <h5 className="font-bold text-sm text-teal-700 mb-2 font-sans">Hoạt động 2: Hình thành kiến thức mới (20-25 phút)</h5>
                        <p className="text-sm leading-relaxed">
                            Giáo viên hướng dẫn học sinh đọc SGK, thảo luận nhóm để giải quyết các nhiệm vụ trọng tâm của bài học.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute left-[-20px] top-0 bottom-0 w-px bg-slate-200"></div>
                        <h5 className="font-bold text-sm text-teal-700 mb-2 font-sans">Hoạt động 3: Luyện tập & Vận dụng (10-15 phút)</h5>
                        <p className="text-sm leading-relaxed">
                            Học sinh thực hành các kỹ năng đã học thông qua bài tập thực tế, sử dụng công cụ số để hoàn thành sản phẩm.
                        </p>
                    </div>
                </div>
            </section>

            <div className="mt-20 flex justify-between font-sans px-10 text-center text-xs">
                <div>
                    <p className="font-bold mb-16">XÁC NHẬN CỦA TỔ CHUYÊN MÔN</p>
                    <p>................................................</p>
                </div>
                <div>
                    <p className="font-bold mb-16">GIÁO VIÊN SOẠN</p>
                    <p>................................................</p>
                </div>
            </div>
        </div>
    );
};

export default LessonPlanDoc;