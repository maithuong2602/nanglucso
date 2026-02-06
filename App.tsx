import { CurriculumData, Grade, Subject, Lesson, Topic, ViewMode, Mappings } from './types';
import { CURRICULUM_DATA, MATH_CURRICULUM, COMPETENCIES_TC1, COMPETENCIES_TC2 } from './constants';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CompetencyTable from './components/CompetencyTable';
import ScheduleTable from './components/ScheduleTable';
import LessonPlanDoc from './components/LessonPlanDoc';
import CompetencyMatrix from './components/CompetencyMatrix';
import ActivityTable from './components/ActivityTable';
import Toast, { ToastMessage } from './components/Toast';
import LoadingOverlay from './components/LoadingOverlay';
import { GoogleGenAI } from "@google/genai";
import { BrainCircuit, X, Sparkles } from 'lucide-react';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Nâng cấp version để reset cache cũ, đảm bảo cấu trúc dữ liệu mới được áp dụng
const STORAGE_KEY = 'eduplan_data_v5'; 
const UI_STATE_KEY = 'eduplan_ui_state_v1';

const isActivityTopic = (topicName: string) => {
    const lower = topicName.toLowerCase();
    return lower.includes("stem") || lower.includes("clb") || lower.includes("câu lạc bộ") || lower.includes("bổ trợ") || lower.includes("trải nghiệm") || lower.includes("ngoại khóa");
};

function App() {
    // Load Data with Smart Merge Logic
    const [fullData, setFullData] = useState<Record<string, CurriculumData>>(() => {
        // 1. Dữ liệu mặc định chuẩn
        const defaultData: Record<string, CurriculumData> = { 
            "Tin học": JSON.parse(JSON.stringify(CURRICULUM_DATA)),
            "Toán": JSON.parse(JSON.stringify(MATH_CURRICULUM))
        };

        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (savedData) {
                const parsed = JSON.parse(savedData);
                
                // 2. Logic hòa trộn thông minh (Deep Merge for Subjects)
                // Nếu người dùng đã lưu dữ liệu, ta dùng dữ liệu đó.
                // NHƯNG nếu trong dữ liệu lưu thiếu môn nào (ví dụ thiếu Toán do lưu từ bản cũ), ta sẽ bù từ default vào.
                const mergedData = { ...parsed };
                
                Object.keys(defaultData).forEach(subject => {
                    if (!mergedData[subject]) {
                        mergedData[subject] = defaultData[subject];
                    }
                });

                return mergedData;
            }
        } catch (error) { console.error("Load failed", error); }
        
        return defaultData;
    });

    // Load UI State
    const [uiState] = useState(() => {
        try {
            const saved = localStorage.getItem(UI_STATE_KEY);
            return saved ? JSON.parse(saved) : {};
        } catch { return {}; }
    });

    const [currentGrade, setGrade] = useState<Grade>(uiState.grade || "6");
    const [currentSubject, setSubject] = useState<Subject>(uiState.subject || "Tin học");
    const [currentLessonId, setCurrentLessonId] = useState<number | string | null>(uiState.lessonId || null);
    const [viewMode, setViewMode] = useState<ViewMode>(uiState.viewMode || 'pl1');
    
    const [filterMode, setFilterMode] = useState<boolean>(true);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [showMatrixModal, setShowMatrixModal] = useState(false);
    
    const [showAiImportModal, setShowAiImportModal] = useState(false);
    const [aiImportText, setAiImportText] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Debounced Data Save
    useEffect(() => { 
        const handler = setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(fullData));
        }, 500); // Save after 500ms of inactivity
        return () => clearTimeout(handler);
    }, [fullData]);

    // UI State Save
    useEffect(() => {
        const state = { grade: currentGrade, subject: currentSubject, lessonId: currentLessonId, viewMode };
        localStorage.setItem(UI_STATE_KEY, JSON.stringify(state));
    }, [currentGrade, currentSubject, currentLessonId, viewMode]);

    const addToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
    }, []);

    const currentSubjectData = fullData[currentSubject] || {};
    const currentGradeData = currentSubjectData[currentGrade] || [];
    const referenceITData = fullData["Tin học"]?.[currentGrade] || [];
    const fullITData = fullData["Tin học"] || {};
    
    const globalUsageMap = useMemo(() => {
        const map: Record<string, Array<{ grade: string, lessonTitle: string, isCurrent: boolean }>> = {};
        const grades: Grade[] = ["6", "7", "8", "9"];
        grades.forEach(g => {
            const gradeTopics = (fullData[currentSubject] || {})[g] || [];
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
    }, [fullData, currentSubject, currentGrade, currentLessonId]);

    const allLessonsInGrade = useMemo(() => currentGradeData.reduce((acc: Lesson[], topic) => [...acc, ...topic.lessons], []), [currentGradeData]);
    
    const getLessonContext = useCallback(() => {
        if (!currentLessonId) return null;
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
        setFullData(prev => {
            // Sao chép an toàn để đảm bảo tính bất biến
            const nextState = { ...prev };
            
            // Đảm bảo object cho môn học hiện tại tồn tại
            if (!nextState[currentSubject]) {
                nextState[currentSubject] = {};
            }
            
            // Cập nhật dữ liệu khối lớp
            nextState[currentSubject] = {
                ...nextState[currentSubject],
                [currentGrade]: newGradeData
            };
            
            return nextState;
        });
    };

    const updateActiveLesson = (updates: Partial<Lesson>) => {
        if (!context) return;
        const newData = JSON.parse(JSON.stringify(currentGradeData));
        newData[context.topicIndex].lessons[context.lessonIndex] = { 
            ...newData[context.topicIndex].lessons[context.lessonIndex], 
            ...updates 
        };
        updateCurriculum(newData);
    };

    // Safe Setters to avoid invalid lesson pointers
    const handleSetGrade = (g: Grade) => {
        setGrade(g);
        setCurrentLessonId(null);
    };
    const handleSetSubject = (s: Subject) => {
        setSubject(s);
        setCurrentLessonId(null);
    };

    const handleAddSupplementary = useCallback((grade: Grade, title: string, competencyCode: string) => {
        setFullData(prev => {
            const subjectData = prev[currentSubject] ? { ...prev[currentSubject] } : {};
            const gradeData = subjectData[grade] ? [...subjectData[grade]] : [];
            
            const newLesson: Lesson = {
                id: Date.now().toString(),
                title: title,
                yccd: ["Thực hiện hoạt động bổ trợ phát triển năng lực số."],
                mappings: {
                    [competencyCode]: { selected: true, reason: 'Hoạt động bổ trợ được đề xuất từ bảng kiểm dò NLS.', type: 'manual' }
                },
                periods: 2,
                equipment: "Máy tính, máy chiếu",
                location: "Phòng học"
            };

            const existingActivityTopicIndex = gradeData.findIndex(t => isActivityTopic(t.topic));
            
            if (existingActivityTopicIndex !== -1) {
                gradeData[existingActivityTopicIndex] = {
                    ...gradeData[existingActivityTopicIndex],
                    lessons: [...gradeData[existingActivityTopicIndex].lessons, newLesson]
                };
            } else {
                gradeData.push({
                    topic: "Hoạt động bổ trợ & STEM",
                    semester: 2,
                    lessons: [newLesson]
                });
            }

            subjectData[grade] = gradeData;
            return { ...prev, [currentSubject]: subjectData };
        });
        addToast('success', `Đã thêm hoạt động bổ trợ cho năng lực ${competencyCode} vào Khối ${grade}.`);
    }, [currentSubject, addToast]);

    const handleUpdateLessonById = (id: number | string, updates: Partial<Lesson>) => {
        const newData = currentGradeData.map(topic => ({
            ...topic,
            lessons: topic.lessons.map(l => String(l.id) === String(id) ? { ...l, ...updates } : l)
        }));
        updateCurriculum(newData);
    };

    const handleBulkUpdateField = (field: 'equipment' | 'location', value: string) => {
        const newData = currentGradeData.map(topic => ({
            ...topic,
            lessons: topic.lessons.map(l => ({ ...l, [field]: value }))
        }));
        updateCurriculum(newData);
        addToast('success', `Đã áp dụng "${value}" cho toàn bộ bài học khối ${currentGrade}.`);
    };

    const handleMoveLesson = (lessonId: number | string, direction: -1 | 1) => {
        const newTopics = JSON.parse(JSON.stringify(currentGradeData));
        for (let i = 0; i < newTopics.length; i++) {
            const idx = newTopics[i].lessons.findIndex((l: Lesson) => String(l.id) === String(lessonId));
            if (idx !== -1) {
                const lessons = newTopics[i].lessons;
                if (idx + direction >= 0 && idx + direction < lessons.length) {
                    const temp = lessons[idx];
                    lessons[idx] = lessons[idx + direction];
                    lessons[idx + direction] = temp;
                    updateCurriculum(newTopics);
                    return;
                }
            }
        }
    };

    const handleMoveTopic = (topicIndex: number, direction: -1 | 1) => {
        const newTopics = JSON.parse(JSON.stringify(currentGradeData));
        if (topicIndex + direction >= 0 && topicIndex + direction < newTopics.length) {
            const temp = newTopics[topicIndex];
            newTopics[topicIndex] = newTopics[topicIndex + direction];
            newTopics[topicIndex + direction] = temp;
            updateCurriculum(newTopics);
        }
    };

    const handleReorderLesson = (sourceId: number | string, targetTopicIndex: number, targetLessonIndex: number) => {
        const newTopics = JSON.parse(JSON.stringify(currentGradeData));
        let lessonToMove: Lesson | null = null;
        let sourceTopicIdx = -1;
        let sourceLessonIdx = -1;

        for (let i = 0; i < newTopics.length; i++) {
            const idx = newTopics[i].lessons.findIndex((l: Lesson) => String(l.id) === String(sourceId));
            if (idx !== -1) {
                sourceTopicIdx = i;
                sourceLessonIdx = idx;
                lessonToMove = newTopics[i].lessons[idx];
                break;
            }
        }

        if (lessonToMove && sourceTopicIdx !== -1) {
            newTopics[sourceTopicIdx].lessons.splice(sourceLessonIdx, 1);
            let finalTargetIdx = targetLessonIndex;
            // Nếu di chuyển trong cùng 1 topic và bài nguồn nằm trước bài đích
            if (sourceTopicIdx === targetTopicIndex && sourceLessonIdx < targetLessonIndex) {
                finalTargetIdx--;
            }
            newTopics[targetTopicIndex].lessons.splice(finalTargetIdx, 0, lessonToMove);
            updateCurriculum(newTopics);
        }
    };

    const handleReorderTopic = (sourceIndex: number, targetIndex: number) => {
        const newTopics = JSON.parse(JSON.stringify(currentGradeData));
        const [movedTopic] = newTopics.splice(sourceIndex, 1);
        
        let finalIdx = targetIndex;
        if (sourceIndex < targetIndex) finalIdx--;
        
        newTopics.splice(finalIdx, 0, movedTopic);
        
        // Cập nhật Học kỳ dựa trên vị trí mới
        const prev = newTopics[finalIdx - 1];
        const next = newTopics[finalIdx + 1];
        if (prev) movedTopic.semester = prev.semester;
        else if (next) movedTopic.semester = next.semester;

        updateCurriculum(newTopics);
    };

    const handleAiImportCurriculum = async () => {
        if (!aiImportText.trim()) return;
        setShowAiImportModal(false);
        setIsAiLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Phân tích văn bản thô sau đây thành danh mục bài học có cấu trúc cho môn ${currentSubject}, Khối ${currentGrade}. 
            Yêu cầu trả về mảng JSON các Topic (Chương/Chủ đề). Mỗi Topic chứa các Lesson. 
            Mỗi Lesson cần có: title, yccd (mảng chuỗi yêu cầu cần đạt bám sát văn bản thô), periods (số tiết dự kiến), equipment (thiết bị), location (địa điểm).
            Văn bản thô: ${aiImportText}`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });

            const parsed = JSON.parse(response.text || "[]");
            if (Array.isArray(parsed)) {
                const formatted = parsed.map((t: any) => ({
                    ...t,
                    semester: t.semester || 1,
                    lessons: t.lessons.map((l: any) => ({ 
                        ...l, 
                        id: Math.random().toString(36).substr(2, 9), 
                        mappings: {},
                        periods: l.periods || 2,
                        equipment: l.equipment || "Máy tính, máy chiếu",
                        location: l.location || "Phòng học"
                    }))
                }));
                updateCurriculum(formatted);
                addToast('success', `Đã tạo ${formatted.length} chủ đề cho môn ${currentSubject}. Dữ liệu đã được lưu!`);
                setAiImportText('');
            }
        } catch (error) {
            console.error(error);
            addToast('error', 'Lỗi phân tích AI. Vui lòng kiểm tra lại văn bản.');
            setShowAiImportModal(true);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleBulkApplyMappings = (newMappings: Mappings) => {
        if (!context) return;
        const currentMappings = activeLesson?.mappings || {};
        updateActiveLesson({
            mappings: { ...currentMappings, ...newMappings }
        });
        addToast('success', 'Đã cập nhật các năng lực được gợi ý.');
    };

    const handleExportWord = () => {
        let fileName = "";
        let orientation = "portrait";
        
        if (viewMode === 'pl1') {
             fileName = "Phu_luc_1_Ke_hoach_NLS";
             orientation = "landscape";
        }
        else if (viewMode === 'pl2') { fileName = "Phu_luc_2_Ke_hoach_HDGD"; orientation = "landscape"; }
        else if (viewMode === 'pl3') { fileName = "Phu_luc_3_Ke_hoach_Day_hoc"; orientation = "landscape"; }
        else { fileName = "Phu_luc_4_KHBD_CV5512"; orientation = "portrait"; }

        const pageSize = orientation === 'landscape' ? '29.7cm 21cm' : '21cm 29.7cm';
        
        let htmlContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset="utf-8"><title>${fileName}</title>
            <style>
                @page Section1 { size: ${pageSize}; mso-page-orientation: ${orientation}; margin: 1.5cm; }
                div.Section1 { page:Section1; }
                body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.3; color: black; }
                table { border-collapse: collapse; width: 100%; border: 1px solid black; margin-bottom: 15px; }
                th, td { border: 1px solid black; padding: 6px; vertical-align: middle; font-size: 12pt; }
                .header-cell { background: #f3f4f6; font-weight: bold; text-align: center; text-transform: uppercase; }
                .text-center { text-align: center; }
                .title-main { text-align: center; text-transform: uppercase; font-weight: bold; font-size: 14pt; margin-bottom: 5px; }
                .subtitle { text-align: center; font-weight: bold; font-size: 13pt; margin-bottom: 20px; }
                .cv-ref { text-align: right; font-style: italic; font-size: 11pt; margin-bottom: 10px; }
            </style></head><body><div class="Section1">
        `;

        if (viewMode === 'pl1') {
             htmlContent += `<div class="title-main">KẾ HOẠCH DẠY HỌC TÍCH HỢP NĂNG LỰC SỐ</div><div class="subtitle">Môn: ${currentSubject} - Khối: ${currentGrade}</div>`;
             let globalPeriod = 1;
             let stt = 1;
            [1, 2].forEach(sem => {
                const semTopics = currentGradeData.filter(t => (t.semester || 1) === sem);
                if (semTopics.length === 0) return;
                htmlContent += `<div style="font-weight:bold; margin: 15px 0;">HỌC KÌ ${sem === 1 ? 'I' : 'II'}</div>`;
                htmlContent += `<table><thead><tr><th class="header-cell" style="width:5%">STT</th><th class="header-cell" style="width:25%">Bài học</th><th class="header-cell" style="width:8%">Tiết</th><th class="header-cell" style="width:8%">Số tiết</th><th class="header-cell" style="width:35%">Yêu cầu cần đạt</th><th class="header-cell" style="width:19%">NLS</th></tr></thead><tbody>`;
                semTopics.forEach(topic => {
                    htmlContent += `<tr><td colspan="6" style="background:#f9fafb; font-weight:bold;">${topic.topic}</td></tr>`;
                    topic.lessons.forEach(l => {
                        const codes = Object.keys(l.mappings || {}).filter(c => l.mappings[c].selected).join(', ');
                        const periods = l.periods || 2;
                        let range = periods === 1 ? `${globalPeriod}` : `${globalPeriod}-${globalPeriod + periods - 1}`;
                        globalPeriod += periods;
                        htmlContent += `<tr><td class="text-center">${stt++}</td><td>${l.title}</td><td class="text-center">${range}</td><td class="text-center">${periods}</td><td>${l.yccd.join('<br>')}</td><td class="text-center font-bold">${codes}</td></tr>`;
                    });
                });
                htmlContent += `</tbody></table>`;
            });
        } else if (viewMode === 'pl3') {
            htmlContent += `
                <div class="cv-ref">Phụ lục III<br>KHUNG KẾ HOẠCH DẠY HỌC MÔN HỌC CỦA TỔ CHUYÊN MÔN<br>(Kèm theo Công văn số 5512/BGDĐT-GDTrH)</div>
                <div class="title-main">KẾ HOẠCH DẠY HỌC CỦA TỔ CHUYÊN MÔN</div>
                <div class="subtitle">MÔN HỌC: ${currentSubject.toUpperCase()} - KHỐI LỚP: ${currentGrade}</div>
            `;
            let globalWeek = 1;
            let stt = 1;
            [1, 2].forEach(sem => {
                const semTopics = currentGradeData.filter(t => (t.semester || 1) === sem);
                if (semTopics.length === 0) return;
                if (sem === 2 && globalWeek < 19) globalWeek = 19;
                htmlContent += `<div style="font-weight:bold; margin-top:20px;">HỌC KÌ ${sem === 1 ? 'I' : 'II'}</div>`;
                htmlContent += `<table><thead><tr>
                    <th class="header-cell">STT</th>
                    <th class="header-cell">Bài dạy / Nội dung</th>
                    <th class="header-cell">Số tiết</th>
                    <th class="header-cell">Thời điểm</th>
                    <th class="header-cell">Thiết bị dạy học</th>
                    <th class="header-cell">Địa điểm</th>
                    <th class="header-cell" style="width:30%">Yêu cầu cần đạt (NLS)</th>
                </tr></thead><tbody>`;
                semTopics.forEach(topic => {
                    htmlContent += `<tr><td colspan="7" style="background:#f9fafb; font-weight:bold;">${topic.topic}</td></tr>`;
                    topic.lessons.forEach(l => {
                        const mappings = l.mappings || {};
                        const nlsContent = Object.keys(mappings)
                            .filter(code => mappings[code].selected)
                            .map(code => {
                                const reason = mappings[code].reason || '';
                                return `<div><b>${code}.</b><br/>${reason}</div>`;
                            })
                            .join('<div style="margin-top:6px; margin-bottom:6px; border-bottom:1px dashed #e5e7eb;"></div>');

                        const p = l.periods || 2;
                        let weekDisp = p <= 1 ? `Tuần ${globalWeek}` : `Tuần ${globalWeek}-${globalWeek + p - 1}`;
                        globalWeek += p;
                        htmlContent += `<tr>
                            <td class="text-center">${stt++}</td>
                            <td>${l.title}</td>
                            <td class="text-center">${p}</td>
                            <td class="text-center font-bold">${weekDisp}</td>
                            <td>${l.equipment || ''}</td>
                            <td>${l.location || ''}</td>
                            <td style="text-align:left; font-size:11pt; vertical-align: top;">${nlsContent}</td>
                        </tr>`;
                    });
                });
                htmlContent += `</tbody></table>`;
            });
        }

        htmlContent += `</div></body></html>`;
        const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}_${currentSubject}_L${currentGrade}.doc`;
        link.click();
        addToast('success', 'Đã xuất file Word thành công!');
    };

    const handleExportJson = () => {
        // Chỉ xuất dữ liệu của môn học hiện tại
        // Lấy chính xác từ fullData dựa trên currentSubject
        const subjectData = fullData[currentSubject];
        
        if (!subjectData || Object.keys(subjectData).length === 0) {
            addToast('error', `Không có dữ liệu để xuất cho môn ${currentSubject}.`);
            return;
        }

        const dataToExport = {
            [currentSubject]: subjectData
        };
        
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 10);
        link.setAttribute("href", dataStr);
        link.setAttribute("download", `EduPlan_${currentSubject}_${timestamp}.json`);
        link.click();
        addToast('info', `Đã tải xuống bản sao lưu cho môn ${currentSubject}.`);
    };

    const handleJsonImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const importedData = JSON.parse(text);
                if (typeof importedData === 'object' && importedData !== null) {
                    setFullData(prev => ({ ...prev, ...importedData }));
                    addToast('success', 'Đã nhập dữ liệu thành công! (Dữ liệu đã được lưu)');
                } else {
                    addToast('error', 'File JSON không hợp lệ.');
                }
            } catch (error) {
                console.error("Import error:", error);
                addToast('error', 'Lỗi khi đọc file JSON.');
            } finally {
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden font-sans text-sm text-slate-700 bg-slate-100">
            <LoadingOverlay isVisible={isAiLoading} message="AI đang xử lý..." />
            
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".json"
                onChange={handleJsonImport}
            />

            {showAiImportModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
                        <div className="bg-gradient-to-r from-violet-700 to-indigo-700 text-white px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center gap-2"><BrainCircuit /> AI Curriculum Architect</h2>
                            <button onClick={() => setShowAiImportModal(false)}><X size={24} /></button>
                        </div>
                        <div className="p-6">
                            <textarea 
                                className="w-full h-80 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-sm font-mono"
                                placeholder="Dán nội dung chương trình thô..."
                                value={aiImportText}
                                onChange={e => setAiImportText(e.target.value)}
                            />
                            <div className="mt-6 flex justify-end gap-3">
                                <button onClick={() => setShowAiImportModal(false)} className="px-5 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Hủy bỏ</button>
                                <button onClick={handleAiImportCurriculum} className="bg-violet-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-violet-700 flex items-center gap-2">
                                    <Sparkles size={18} /> Phân tích với AI
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <CompetencyMatrix 
                isVisible={showMatrixModal} onClose={() => setShowMatrixModal(false)}
                currentSubject={currentSubject} fullSubjectData={currentSubjectData} itData={fullITData}
                onAddSupplementaryLesson={handleAddSupplementary}
            />

            <Header 
                currentGrade={currentGrade} setGrade={handleSetGrade} 
                currentSubject={currentSubject} setSubject={handleSetSubject}
                viewMode={viewMode} setViewMode={setViewMode}
                onExportWord={handleExportWord} onExportJson={handleExportJson}
                onImportJson={() => fileInputRef.current?.click()}
                onOpenMatrix={() => setShowMatrixModal(true)}
            />

            <div className="flex flex-grow overflow-hidden">
                <Sidebar 
                    topics={currentGradeData} currentLessonId={currentLessonId}
                    onSelectLesson={setCurrentLessonId}
                    onOpenAiImport={() => setShowAiImportModal(true)}
                    onAddLesson={() => {
                        const l: Lesson = { id: Date.now().toString(), title: "Bài học mới", yccd: [""], mappings: {}, periods: 2, equipment: "Máy tính", location: "Phòng học" };
                        const newData = JSON.parse(JSON.stringify(currentGradeData));
                        if (newData.length > 0) newData[0].lessons.push(l);
                        else newData.push({ topic: "Chủ đề mới", semester: 1, lessons: [l] });
                        updateCurriculum(newData);
                        setCurrentLessonId(l.id);
                    }}
                    onAddTopic={() => updateCurriculum([...currentGradeData, { topic: "Chủ đề mới", semester: 1, lessons: [] }])}
                    onDeleteLesson={(id) => updateCurriculum(currentGradeData.map(t => ({ ...t, lessons: t.lessons.filter(l => String(l.id) !== String(id)) })))}
                    onMoveLesson={handleMoveLesson} 
                    onMoveTopic={handleMoveTopic} 
                    onReorderLesson={handleReorderLesson}
                    onReorderTopic={handleReorderTopic}
                />
                <main className="flex-grow overflow-y-auto custom-scroll p-6 bg-slate-50 relative">
                    {viewMode === 'pl1' && activeLesson && (
                        <CompetencyTable 
                            lesson={activeLesson} competencies={activeCompetencies} currentSubject={currentSubject}
                            filterMode={filterMode} onToggleFilter={() => setFilterMode(!filterMode)}
                            topicName={context?.topic.topic || ""} isAiLoading={isAiLoading}
                            allLessonsInGrade={allLessonsInGrade}
                            referenceITData={referenceITData} usageMap={globalUsageMap}
                            onUpdateTitle={(t) => updateActiveLesson({ title: t })}
                            onUpdateTopic={(t) => { const nd = JSON.parse(JSON.stringify(currentGradeData)); nd[context!.topicIndex].topic = t; updateCurriculum(nd); }}
                            onUpdateYCCD={(i, v) => { const ny = [...activeLesson.yccd]; ny[i] = v; updateActiveLesson({ yccd: ny }); }}
                            onBulkUpdateYCCD={(y) => updateActiveLesson({ yccd: y })}
                            onAddYCCD={() => updateActiveLesson({ yccd: [...activeLesson.yccd, ""] })}
                            onDeleteYCCD={(i) => { const ny = [...activeLesson.yccd]; ny.splice(i, 1); updateActiveLesson({ yccd: ny }); }}
                            onMappingChange={(c, s) => { const nm = { ...activeLesson.mappings }; if (s) nm[c] = { selected: true, reason: '' }; else delete nm[c]; updateActiveLesson({ mappings: nm }); }}
                            onReasonChange={(c, r) => { const nm = { ...activeLesson.mappings }; if (nm[c]) nm[c].reason = r; updateActiveLesson({ mappings: nm }); }}
                            onBulkApplyMappings={handleBulkApplyMappings}
                            onSuggestAI={() => {}} onRewriteReasonWithAI={async () => {}} onSplitLesson={() => {}} onMergeNext={() => {}} onMergePrevious={() => {}}
                            canMergeNext={false} canMergePrevious={false}
                        />
                    )}
                    {viewMode === 'pl3' && (
                        <ScheduleTable 
                            topics={currentGradeData} competencies={activeCompetencies}
                            onUpdateLesson={handleUpdateLessonById}
                            onBulkUpdateField={handleBulkUpdateField}
                        />
                    )}
                    {viewMode === 'pl2' && <ActivityTable fullSubjectData={currentSubjectData} onUpdateActivity={() => {}} />}
                    {viewMode === 'pl4' && activeLesson && <LessonPlanDoc lesson={activeLesson} competencies={activeCompetencies} currentSubject={currentSubject} currentGrade={currentGrade} onUpdateLesson={updateActiveLesson} />}
                </main>
            </div>
            <Toast toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
        </div>
    );
}

export default App;
