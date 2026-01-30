
import { CurriculumData, Grade, Subject, Lesson, Topic, ViewMode } from './types';
import { CURRICULUM_DATA, COMPETENCIES_TC1, COMPETENCIES_TC2 } from './constants';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CompetencyTable from './components/CompetencyTable';
import ScheduleTable from './components/ScheduleTable';
import LessonPlanDoc from './components/LessonPlanDoc';
import CompetencyMatrix from './components/CompetencyMatrix';
import ActivityTable from './components/ActivityTable';
import Toast, { ToastMessage } from './components/Toast';
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { RotateCcw } from 'lucide-react';
import React, { useState, useEffect, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'eduplan_data_v4';

const isQuotaError = (error: any): boolean => {
    if (error?.status === 429 || error?.code === 429 || String(error?.message).includes("429")) return true;
    return false;
};

const callWithRetry = async <T,>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> => {
    try { return await fn(); } catch (error) {
        if (retries > 0 && isQuotaError(error)) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return callWithRetry<T>(fn, retries - 1, delay * 2);
        }
        throw error;
    }
};

const isActivityTopic = (topicName: string) => {
    const lower = topicName.toLowerCase();
    return lower.includes("stem") || lower.includes("clb") || lower.includes("câu lạc bộ") || lower.includes("bổ trợ") || lower.includes("trải nghiệm") || lower.includes("ngoại khóa");
};

function App() {
    const [fullData, setFullData] = useState<Record<string, CurriculumData>>(() => {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (savedData) return JSON.parse(savedData);
        } catch (error) { console.error("Load failed", error); }
        return { "Tin học": JSON.parse(JSON.stringify(CURRICULUM_DATA)) };
    });

    const [currentGrade, setGrade] = useState<Grade>("6");
    const [currentSubject, setSubject] = useState<Subject>("Tin học");
    const [currentLessonId, setCurrentLessonId] = useState<number | string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('pl1');
    const [filterMode, setFilterMode] = useState<boolean>(true);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [showMatrixModal, setShowMatrixModal] = useState(false);

    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(fullData)); }, [fullData]);

    const addToast = (type: 'success' | 'error' | 'info', message: string) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
    };

    const currentSubjectData = fullData[currentSubject] || {};
    const currentGradeData = currentSubjectData[currentGrade] || [];
    
    // Extract IT Data for cross-reference
    const referenceITData = fullData["Tin học"]?.[currentGrade] || [];
    // Full IT Data for Matrix Gap Analysis
    const fullITData = fullData["Tin học"] || {};
    
    const globalUsageMap = useMemo(() => {
        const map: Record<string, Array<{ grade: string, lessonTitle: string, isCurrent: boolean }>> = {};
        const grades: Grade[] = ["6", "7", "8", "9"];
        grades.forEach(g => {
            const gradeTopics = currentSubjectData[g] || [];
            gradeTopics.forEach(topic => {
                topic.lessons.forEach(l => {
                    if (l.mappings) {
                        Object.keys(l.mappings).forEach(code => {
                            if (!map[code]) map[code] = [];
                            map[code].push({ grade: g, lessonTitle: l.title, isCurrent: g === currentGrade && String(l.id) === String(currentLessonId) });
                        });
                    }
                });
            });
        });
        return map;
    }, [currentSubjectData, currentGrade, currentLessonId]);

    const allLessonsInGrade = useMemo(() => currentGradeData.reduce((acc: Lesson[], topic) => [...acc, ...topic.lessons], []), [currentGradeData]);
    const getLessonContext = useCallback(() => {
        for (let tIndex = 0; tIndex < currentGradeData.length; tIndex++) {
            const topic = currentGradeData[tIndex];
            const lIndex = topic.lessons.findIndex(l => String(l.id) === String(currentLessonId));
            if (lIndex !== -1) return { topic, lesson: topic.lessons[lIndex], topicIndex: tIndex, lessonIndex: lIndex };
        }
        return null;
    }, [currentGradeData, currentLessonId]);

    const context = getLessonContext();
    const activeLesson = context?.lesson;
    const activeCompetencies = (currentGrade === "6" || currentGrade === "7") ? COMPETENCIES_TC1 : COMPETENCIES_TC2;

    const updateCurriculum = (newGradeData: Topic[]) => {
        setFullData(prev => ({ ...prev, [currentSubject]: { ...prev[currentSubject], [currentGrade]: newGradeData } }));
    };

    const updateActiveLesson = (updates: Partial<Lesson>) => {
        if (!context) return;
        const newData = [...currentGradeData];
        const newTopic = { ...newData[context.topicIndex] };
        const newLessons = [...newTopic.lessons];
        newLessons[context.lessonIndex] = { ...newLessons[context.lessonIndex], ...updates };
        newTopic.lessons = newLessons;
        newData[context.topicIndex] = newTopic;
        updateCurriculum(newData);
    };

    // Handler to update activity in PL2 across grades
    const handleUpdateActivity = (grade: string, lessonId: number | string, updates: Partial<Lesson>) => {
        const gradeData = fullData[currentSubject]?.[grade];
        if (!gradeData) return;

        // Find the lesson
        let found = false;
        const newGradeData = gradeData.map(topic => {
            if (found) return topic;
            if (!isActivityTopic(topic.topic)) return topic;

            const lessonIdx = topic.lessons.findIndex(l => l.id === lessonId);
            if (lessonIdx !== -1) {
                const newLessons = [...topic.lessons];
                newLessons[lessonIdx] = { ...newLessons[lessonIdx], ...updates };
                found = true;
                return { ...topic, lessons: newLessons };
            }
            return topic;
        });

        if (found) {
            setFullData(prev => ({
                ...prev,
                [currentSubject]: {
                    ...prev[currentSubject],
                    [grade]: newGradeData
                }
            }));
        }
    };

    // Handler to add supplementary STEM/Club lesson from Matrix
    const handleAddSupplementary = (grade: Grade, title: string, competencyCode: string) => {
        const targetData = fullData[currentSubject]?.[grade] || [];
        const newData = [...targetData];
        
        // Find or create "Hoạt động bổ trợ / STEM" topic
        let topicIdx = newData.findIndex(t => isActivityTopic(t.topic));
        if (topicIdx === -1) {
            newData.push({ topic: "Hoạt động bổ trợ / STEM / CLB", semester: 2, lessons: [] });
            topicIdx = newData.length - 1;
        }

        const newLesson: Lesson = {
            id: Date.now(),
            title: title,
            yccd: [`Phát triển năng lực số: ${competencyCode}`],
            mappings: { [competencyCode]: { selected: true, type: 'manual', reason: 'Hoạt động tăng cường lấp lỗ hổng năng lực.' } },
            periods: 2,
            equipment: "Phòng STEM",
            location: "Trường học",
            host: "GV Bộ môn",
            collaborator: "GVCN"
        };

        newData[topicIdx].lessons.push(newLesson);

        setFullData(prev => ({
            ...prev,
            [currentSubject]: {
                ...prev[currentSubject],
                [grade]: newData
            }
        }));
        
        addToast('success', `Đã thêm hoạt động "${title}" vào Kế hoạch dạy học Lớp ${grade}.`);
    };

    const handleExportWord = () => {
        let fileName = "";
        let orientation = "portrait";
        
        if (viewMode === 'pl1') fileName = "Phu_luc_1_Ke_hoach_NLS";
        else if (viewMode === 'pl2') { fileName = "Phu_luc_2_Ke_hoach_HDGD"; orientation = "landscape"; }
        else if (viewMode === 'pl3') fileName = "Phu_luc_3_Ke_hoach_Day_hoc";
        else { fileName = "Phu_luc_4_KHBD_CV5512"; orientation = "portrait"; }

        const pageSize = orientation === 'landscape' ? '29.7cm 21cm' : '21cm 29.7cm';
        
        let htmlContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset="utf-8"><title>${fileName}</title>
            <style>
                @page Section1 { size: ${pageSize}; mso-page-orientation: ${orientation}; margin: 2.0cm; }
                div.Section1 { page:Section1; }
                body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.3; color: black; }
                table { border-collapse: collapse; width: 100%; border: 1px solid black; margin-bottom: 15px; }
                th, td { border: 1px solid black; padding: 6px; vertical-align: top; font-size: 13pt; font-family: 'Times New Roman', serif; }
                .header-cell { background: #f1f5f9; font-weight: bold; text-align: center; text-transform: uppercase; }
                .text-center { text-align: center; }
                .font-bold { font-weight: bold; }
                .italic { font-style: italic; }
                .title-main { text-align: center; text-transform: uppercase; font-weight: bold; font-size: 14pt; margin-bottom: 5px; }
                .subtitle { text-align: center; font-weight: bold; font-size: 13pt; margin-bottom: 20px; }
                .cv5512-header { text-align: right; font-style: italic; margin-bottom: 10px; font-size: 11pt; }
                .section-title { font-weight: bold; text-transform: uppercase; margin-top: 15px; margin-bottom: 5px; }
                .activity-box { border: 1px solid #000; padding: 10px; margin-bottom: 10px; }
                .nls-box { background-color: #f0fdfa; border: 1px dashed #0d9488; padding: 5px; margin-top: 5px; font-size: 12pt; }
            </style></head><body><div class="Section1">
        `;

        if (viewMode === 'pl1') {
             // ... existing PL1 export logic ...
             htmlContent += `
                <div class="title-main">KẾ HOẠCH DẠY HỌC TÍCH HỢP NĂNG LỰC SỐ (PHỤ LỤC 1)</div>
                <div class="subtitle">Môn: ${currentSubject} - Khối: ${currentGrade}</div>
             `;
             let globalPeriod = 1;
             let stt = 1;
            [1, 2].forEach(sem => {
                const semTopics = currentGradeData.filter(t => (t.semester || 1) === sem);
                if (semTopics.length === 0) return;
                htmlContent += `<div style="font-weight:bold; margin-top:20px;">HỌC KÌ ${sem === 1 ? 'I' : 'II'}</div>`;
                htmlContent += `<table><thead><tr><th class="header-cell" style="width:5%">STT</th><th class="header-cell" style="width:25%">Bài học</th><th class="header-cell" style="width:10%">Tiết</th><th class="header-cell" style="width:10%">Số tiết</th><th class="header-cell" style="width:35%">Yêu cầu cần đạt</th><th class="header-cell" style="width:15%">NLS</th></tr></thead><tbody>`;
                semTopics.forEach(topic => {
                    htmlContent += `<tr><td colspan="6" style="background:#f8fafc; font-weight:bold;">${topic.topic}</td></tr>`;
                    topic.lessons.forEach(l => {
                        const codes = Object.keys(l.mappings || {}).filter(c => l.mappings[c].selected).join('<br>');
                        const periodsCount = l.periods || (l.title.toLowerCase().includes("kiểm tra") ? 1 : 2);
                        let periodRange = periodsCount === 1 ? `${globalPeriod}` : `${globalPeriod} - ${globalPeriod + periodsCount - 1}`;
                        globalPeriod += periodsCount;
                        htmlContent += `<tr><td class="text-center">${stt++}</td><td>${l.title}</td><td class="text-center">${periodRange}</td><td class="text-center">${periodsCount}</td><td>${l.yccd.map(y => `- ${y}`).join('<br>')}</td><td class="text-center font-bold">${codes}</td></tr>`;
                    });
                });
                htmlContent += `</tbody></table>`;
            });
        } else if (viewMode === 'pl2') {
             htmlContent += `
                <table style="width: 100%; border: none; margin-bottom: 20px;">
                    <tr>
                        <td style="width: 40%; text-align: center; vertical-align: top; border: none;">
                            TRƯỜNG: ........................................<br>
                            <b>TỔ: .............................................</b>
                        </td>
                        <td style="width: 60%; text-align: center; vertical-align: top; border: none;">
                            <b>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><br>
                            <b>Độc lập - Tự do - Hạnh phúc</b>
                        </td>
                    </tr>
                </table>

                <div style="text-align: center; font-weight: bold; margin-bottom: 5px; margin-top: 20px;">
                    KẾ HOẠCH TỔ CHỨC CÁC HOẠT ĐỘNG GIÁO DỤC CỦA TỔ CHUYÊN MÔN
                </div>
                <div style="text-align: center; margin-bottom: 20px; font-weight: bold;">(Năm học 20..... - 20.....)</div>

                <div style="text-align: right; font-style: italic; margin-bottom: 20px;">
                    Phụ lục II<br>
                    KHUNG KẾ HOẠCH TỔ CHỨC CÁC HOẠT ĐỘNG GIÁO DỤC CỦA TỔ CHUYÊN MÔN<br>
                    (Kèm theo Công văn số 5512/BGDĐT-GDTrH ngày 18 tháng 12 năm 2020 của Bộ GDĐT)
                </div>
             `;
             
             const grades: Grade[] = ["6", "7", "8", "9"];
             let hasActivity = false;

             grades.forEach((g, gIdx) => {
                 const gData = currentSubjectData[g] || [];
                 
                 // Calculate timings
                 let currentWeek = 1;
                 const lessonTimings: Record<string | number, string> = {};
                 
                 gData.forEach(topic => {
                     if (topic.semester === 2 && currentWeek < 19) currentWeek = 19;
                     topic.lessons.forEach(l => {
                         const p = l.periods || (l.title.toLowerCase().includes("kiểm tra") ? 1 : 2);
                         const start = currentWeek;
                         const end = currentWeek + p - 1;
                         const timing = start === end ? `Tuần ${start}` : `Tuần ${start} - ${end}`;
                         lessonTimings[l.id] = timing;
                         currentWeek += p;
                     });
                 });

                 const activityLessons: Lesson[] = [];
                 gData.forEach(t => {
                     if (isActivityTopic(t.topic)) activityLessons.push(...t.lessons);
                 });

                 if (activityLessons.length > 0) {
                     hasActivity = true;
                     htmlContent += `<div style="font-weight:bold; margin-top:15px; margin-bottom:5px;">${gIdx + 1}. Khối lớp: ${g}; Số học sinh: ....................</div>`;
                     htmlContent += `<table><thead><tr>
                        <th class="header-cell" style="width:5%">STT</th>
                        <th class="header-cell" style="width:20%">Chủ đề<br>(1)</th>
                        <th class="header-cell" style="width:25%">Yêu cầu cần đạt<br>(2)</th>
                        <th class="header-cell" style="width:5%">Số tiết<br>(3)</th>
                        <th class="header-cell" style="width:10%">Thời điểm<br>(4)</th>
                        <th class="header-cell" style="width:10%">Địa điểm<br>(5)</th>
                        <th class="header-cell" style="width:10%">Chủ trì<br>(6)</th>
                        <th class="header-cell" style="width:10%">Phối hợp<br>(7)</th>
                        <th class="header-cell" style="width:5%">Điều kiện<br>(8)</th>
                     </tr></thead><tbody>`;
                     
                     activityLessons.forEach((l, i) => {
                         htmlContent += `<tr>
                            <td class="text-center">${i + 1}</td>
                            <td>${l.title}</td>
                            <td>${l.yccd.map(y => `- ${y}`).join('<br>')}</td>
                            <td class="text-center">${l.periods || 2}</td>
                            <td class="text-center">${lessonTimings[l.id] || ''}</td>
                            <td>${l.location || ''}</td>
                            <td>${l.host || ''}</td>
                            <td>${l.collaborator || ''}</td>
                            <td>${l.equipment || ''}</td>
                         </tr>`;
                     });
                     htmlContent += `</tbody></table>`;
                 }
             });

             if (!hasActivity) {
                 htmlContent += `<p style="text-align:center; font-style:italic;">Chưa có hoạt động giáo dục nào.</p>`;
             }

             htmlContent += `
                <div style="display:flex; justify-content:space-between; margin-top:30px; font-weight:bold;">
                    <div style="text-align:center;">TỔ TRƯỞNG<br><span style="font-weight:normal; font-style:italic;">(Ký và ghi rõ họ tên)</span></div>
                    <div style="text-align:center;">HIỆU TRƯỞNG<br><span style="font-weight:normal; font-style:italic;">(Ký và ghi rõ họ tên)</span></div>
                </div>
             `;
        } else if (viewMode === 'pl3') {
            // ... existing PL3 export logic ...
            htmlContent += `<div class="title-main">KẾ HOẠCH DẠY HỌC MÔN HỌC (PHỤ LỤC 3)</div><div class="subtitle">Môn: ${currentSubject} - Khối: ${currentGrade}</div>`;
            let globalWeek = 1;
            let stt = 1;
            [1, 2].forEach(sem => {
                const semTopics = currentGradeData.filter(t => (t.semester || 1) === sem);
                if (semTopics.length === 0) return;
                if (sem === 2 && globalWeek < 19) globalWeek = 19;
                htmlContent += `<div style="font-weight:bold; margin-top:20px;">HỌC KÌ ${sem === 1 ? 'I' : 'II'}</div>`;
                htmlContent += `<table><thead><tr><th class="header-cell">STT</th><th class="header-cell">Bài dạy / Nội dung</th><th class="header-cell">Số tiết</th><th class="header-cell">Thời điểm</th><th class="header-cell">Thiết bị dạy học</th><th class="header-cell">Địa điểm</th><th class="header-cell">NLS Tích hợp</th></tr></thead><tbody>`;
                semTopics.forEach(topic => {
                    htmlContent += `<tr><td colspan="7" style="background:#f8fafc; font-weight:bold;">${topic.topic}</td></tr>`;
                    topic.lessons.forEach(l => {
                        const codes = Object.keys(l.mappings || {}).filter(c => l.mappings[c].selected).join(', ');
                        const periods = l.periods || (l.title.toLowerCase().includes("kiểm tra") ? 1 : 2);
                        let weekDisp = periods <= 1 ? `Tuần ${globalWeek}` : `Tuần ${globalWeek} - ${globalWeek + periods - 1}`;
                        globalWeek += periods;
                        htmlContent += `<tr><td class="text-center">${stt++}</td><td>${l.title}</td><td class="text-center">${periods}</td><td class="text-center font-bold">${weekDisp}</td><td>${l.equipment || ''}</td><td>${l.location || ''}</td><td class="text-center">${codes}</td></tr>`;
                    });
                });
                htmlContent += `</tbody></table>`;
            });
        } else if (viewMode === 'pl4' && activeLesson) {
            // ... (Existing PL4 logic) ...
            const selectedCodes = Object.keys(activeLesson.mappings || {}).filter(c => activeLesson.mappings[c].selected);
            const getReason = (c: string) => activeLesson.mappings[c]?.reason || '';
            const getText = (c: string) => activeCompetencies.find(x => x.code === c)?.text || '';
            const nlsListHtml = selectedCodes.length > 0 
                    ? `<ul style="margin-left:20px;">${selectedCodes.map(c => `<li><b>${c}:</b> ${getText(c)}.<br><i>Minh chứng: ${getReason(c)}</i></li>`).join('')}</ul>` 
                    : '<p style="margin-left:20px; font-style:italic;">Chưa chọn năng lực số tích hợp.</p>';
            
            // Common Header for PL4
            htmlContent += `
                <div class="cv5512-header">
                    Phụ lục IV<br>KHUNG KẾ HOẠCH BÀI DẠY<br>(Kèm theo Công văn số 5512/BGDĐT-GDTrH)
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
                    <div>Trường: ........................................<br>Tổ: .............................................</div>
                    <div>Họ và tên giáo viên:<br>.......................................................</div>
                </div>
                <div class="title-main">TÊN BÀI DẠY: ${activeLesson.title.toUpperCase()}</div>
                <div class="text-center" style="margin-bottom:20px;">Môn học: ${currentSubject}; Lớp: ${currentGrade}<br>Thời gian thực hiện: ${activeLesson.periods || 1} tiết</div>

                <div class="section-title">I. MỤC TIÊU</div>
                <div style="margin-left: 10px;">
                    <p><b>1. Về kiến thức:</b></p>
                    <ul style="margin-left: 20px;">${activeLesson.yccd.map(y => `<li>${y}</li>`).join('')}</ul>
                    <p><b>2. Về năng lực:</b></p>
                    <p style="margin-left: 20px;">- <b>Năng lực chung:</b> Tự chủ và tự học, Giao tiếp và hợp tác, Giải quyết vấn đề và sáng tạo.</p>
                    <p style="margin-left: 20px;">- <b>Năng lực riêng:</b> Nhận thức khoa học, Tìm hiểu tự nhiên, Vận dụng kiến thức.</p>
                    <p style="margin-left: 20px; text-decoration: underline;">- <b>Năng lực số (Tích hợp):</b></p>
                    ${nlsListHtml}
                    <p><b>3. Về phẩm chất:</b></p>
                    <p style="margin-left: 20px;">Chăm chỉ, trung thực, trách nhiệm.</p>
                </div>

                <div class="section-title">II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</div>
                <ul style="margin-left: 20px;">
                    <li>Thiết bị: ${activeLesson.equipment || 'Máy tính, máy chiếu.'}</li>
                    <li>Học liệu: SGK, phiếu học tập.</li>
                </ul>

                <div class="section-title">III. TIẾN TRÌNH DẠY HỌC</div>
            `;

            if (activeLesson.planData && activeLesson.planData.length > 0) {
                activeLesson.planData.forEach(section => {
                    htmlContent += `
                        <div class="activity-box">
                            <p><b>${section.label}. ${section.title}</b> (${section.duration ? section.duration + " phút" : ""})</p>
                            <p><b>a) Mục tiêu:</b> ${section.objective}</p>
                            <p><b>b) Nội dung:</b> ${section.content}</p>
                            <p><b>c) Sản phẩm:</b> ${section.product}</p>
                            <p><b>d) Tổ chức thực hiện:</b></p>
                            <div style="margin-left:15px;">
                                ${section.steps.map(step => `
                                    <p><b>- ${step.title}:</b> ${step.content}</p>
                                    ${step.nlsCodes && step.nlsCodes.length > 0 ? `<div class="nls-box"><b>* Tích hợp NLS:</b> ${step.nlsCodes.join(', ')}</div>` : ''}
                                `).join('')}
                            </div>
                        </div>
                    `;
                });
            } else if (activeLesson.activities) {
                htmlContent += activeLesson.activities;
            } else {
                htmlContent += `<p style="text-align:center; font-style:italic;">(Chưa có nội dung chi tiết)</p>`;
            }
        }

        htmlContent += `</div></body></html>`;
        const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}_${currentSubject}_${viewMode === 'pl2' ? 'ToanCap' : `L${currentGrade}`}.doc`;
        link.click();
        addToast('success', 'Đã xuất file Word thành công!');
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden font-sans text-sm text-slate-700 bg-slate-100">
            <CompetencyMatrix 
                isVisible={showMatrixModal}
                onClose={() => setShowMatrixModal(false)}
                currentSubject={currentSubject}
                fullSubjectData={currentSubjectData}
                itData={fullITData}
                onAddSupplementaryLesson={handleAddSupplementary}
            />
            <Header 
                currentGrade={currentGrade} setGrade={setGrade} 
                currentSubject={currentSubject} setSubject={setSubject}
                viewMode={viewMode} setViewMode={setViewMode}
                onExportWord={handleExportWord}
                onOpenMatrix={() => setShowMatrixModal(true)}
                onExportJson={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullData, null, 2));
                    const link = document.createElement('a');
                    link.setAttribute("href", dataStr);
                    link.setAttribute("download", `EduPlan_Backup.json`);
                    link.click();
                }}
            />
            <div className="flex flex-grow overflow-hidden">
                <Sidebar 
                    topics={currentGradeData} currentLessonId={currentLessonId}
                    onSelectLesson={setCurrentLessonId}
                    onAddLesson={() => {
                        const newData = [...currentGradeData];
                        if (newData.length === 0) newData.push({ topic: "Chủ đề mới", semester: 1, lessons: [] });
                        const newL: Lesson = { id: Date.now(), title: "Bài học mới", yccd: [""], mappings: {}, periods: 2, equipment: "Máy tính, máy chiếu", location: "Phòng Tin học" };
                        newData[0].lessons.push(newL);
                        updateCurriculum(newData);
                        setCurrentLessonId(newL.id);
                    }}
                    onAddTopic={() => updateCurriculum([...currentGradeData, { topic: "Chủ đề mới", semester: 1, lessons: [] }])}
                    onDeleteLesson={(id) => updateCurriculum(currentGradeData.map(t => ({ ...t, lessons: t.lessons.filter(l => l.id !== id) })))}
                    onMoveLesson={(id, dir) => {}} onMoveTopic={(idx, dir) => {}} onReorderLesson={() => {}}
                />
                <main className="flex-grow overflow-y-auto custom-scroll p-6 bg-slate-50 relative">
                    {viewMode === 'pl2' ? (
                        <ActivityTable 
                            fullSubjectData={currentSubjectData}
                            onUpdateActivity={handleUpdateActivity}
                        />
                    ) : (
                        activeLesson ? (
                            <>
                                {viewMode === 'pl1' && <CompetencyTable 
                                    lesson={activeLesson} competencies={activeCompetencies} currentSubject={currentSubject}
                                    filterMode={filterMode} onToggleFilter={() => setFilterMode(!filterMode)}
                                    topicName={context?.topic.topic || ""} isAiLoading={isAiLoading}
                                    usageMap={globalUsageMap} allLessonsInGrade={allLessonsInGrade}
                                    referenceITData={referenceITData}
                                    onUpdateTitle={(t) => updateActiveLesson({ title: t })}
                                    onUpdateTopic={(t) => { const nd = [...currentGradeData]; nd[context!.topicIndex].topic = t; updateCurriculum(nd); }}
                                    onUpdateYCCD={(i, v) => { const ny = [...activeLesson.yccd]; ny[i] = v; updateActiveLesson({ yccd: ny }); }}
                                    onBulkUpdateYCCD={(y) => updateActiveLesson({ yccd: y })}
                                    onAddYCCD={() => updateActiveLesson({ yccd: [...activeLesson.yccd, ""] })}
                                    onDeleteYCCD={(i) => { const ny = [...activeLesson.yccd]; ny.splice(i, 1); updateActiveLesson({ yccd: ny }); }}
                                    onMappingChange={(c, s) => { const nm = { ...activeLesson.mappings }; if (s) nm[c] = { selected: true, reason: '' }; else delete nm[c]; updateActiveLesson({ mappings: nm }); }}
                                    onReasonChange={(c, r) => { const nm = { ...activeLesson.mappings }; if (nm[c]) nm[c].reason = r; updateActiveLesson({ mappings: nm }); }}
                                    onSuggestAI={() => {}} onRewriteReasonWithAI={async () => {}} onSplitLesson={() => {}} onMergeNext={() => {}} onMergePrevious={() => {}}
                                    canMergeNext={false} canMergePrevious={false}
                                />}
                                {viewMode === 'pl3' && <ScheduleTable 
                                    topics={currentGradeData} competencies={activeCompetencies}
                                    onUpdateLesson={(id, upd) => updateCurriculum(currentGradeData.map(t => ({ ...t, lessons: t.lessons.map(l => l.id === id ? { ...l, ...upd } : l) })))}
                                    onBulkUpdateField={(f, v) => {
                                        updateCurriculum(currentGradeData.map(t => ({ ...t, lessons: t.lessons.map(l => ({ ...l, [f]: v })) })));
                                        addToast('success', `Đã áp dụng "${v}" cho toàn bộ kế hoạch.`);
                                    }}
                                />}
                                {viewMode === 'pl4' && <LessonPlanDoc 
                                    lesson={activeLesson} 
                                    competencies={activeCompetencies} 
                                    currentSubject={currentSubject}
                                    currentGrade={currentGrade}
                                    onUpdateLesson={updateActiveLesson}
                                />}
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 italic">Chọn bài học để bắt đầu.</div>
                        )
                    )}
                </main>
            </div>
            <Toast toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
        </div>
    );
}

export default App;
