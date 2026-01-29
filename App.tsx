
import { CurriculumData, Grade, Subject, Lesson, Topic, ViewMode } from './types';
import { CURRICULUM_DATA, COMPETENCIES_TC1, COMPETENCIES_TC2 } from './constants';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CompetencyTable from './components/CompetencyTable';
import ScheduleTable from './components/ScheduleTable';
import LessonPlanDoc from './components/LessonPlanDoc';
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

    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(fullData)); }, [fullData]);

    const addToast = (type: 'success' | 'error' | 'info', message: string) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
    };

    const currentSubjectData = fullData[currentSubject] || {};
    const currentGradeData = currentSubjectData[currentGrade] || [];
    const referenceITData = fullData["Tin học"]?.[currentGrade] || [];

    // Global competency usage map for the current subject
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
                            map[code].push({ 
                                grade: g, 
                                lessonTitle: l.title,
                                isCurrent: g === currentGrade && String(l.id) === String(currentLessonId)
                            });
                        });
                    }
                });
            });
        });
        return map;
    }, [currentSubjectData, currentGrade, currentLessonId]);

    const allLessonsInGrade = useMemo(() => {
        return currentGradeData.reduce((acc: Lesson[], topic) => [...acc, ...topic.lessons], []);
    }, [currentGradeData]);

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
        setFullData(prev => ({
            ...prev,
            [currentSubject]: { ...prev[currentSubject], [currentGrade]: newGradeData }
        }));
    };

    const handleResetToDefaults = () => {
        if (window.confirm(`Khôi phục dữ liệu mặc định cho môn ${currentSubject}?`)) {
            if (currentSubject === "Tin học") {
                setFullData(prev => ({
                    ...prev,
                    [currentSubject]: JSON.parse(JSON.stringify(CURRICULUM_DATA))
                }));
                addToast('success', `Đã khôi phục dữ liệu môn ${currentSubject}`);
            } else {
                addToast('info', `Dữ liệu mặc định chỉ có sẵn cho môn Tin học.`);
            }
        }
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

    const handleReorderLesson = (sourceId: string | number, targetTopicIdx: number, targetLessonIdx: number) => {
        const newData = [...currentGradeData];
        let sourceTopicIdx = -1;
        let sourceLessonIdx = -1;
        let lessonToMove: Lesson | null = null;

        newData.forEach((topic, tIdx) => {
            const lIdx = topic.lessons.findIndex(l => String(l.id) === String(sourceId));
            if (lIdx !== -1) {
                sourceTopicIdx = tIdx;
                sourceLessonIdx = lIdx;
                lessonToMove = topic.lessons[lIdx];
            }
        });

        if (!lessonToMove) return;

        newData[sourceTopicIdx].lessons.splice(sourceLessonIdx, 1);
        newData[targetTopicIdx].lessons.splice(targetLessonIdx, 0, lessonToMove);
        
        updateCurriculum(newData);
        addToast('info', 'Đã sắp xếp lại bài học.');
    };

    const handleMoveLesson = (lessonId: string | number, direction: -1 | 1) => {
        const newData = [...currentGradeData];
        let found = false;
        
        newData.forEach(topic => {
            if (found) return;
            const idx = topic.lessons.findIndex(l => String(l.id) === String(lessonId));
            if (idx !== -1) {
                const targetIdx = idx + direction;
                if (targetIdx >= 0 && targetIdx < topic.lessons.length) {
                    const temp = topic.lessons[idx];
                    topic.lessons[idx] = topic.lessons[targetIdx];
                    topic.lessons[targetIdx] = temp;
                    found = true;
                }
            }
        });

        if (found) updateCurriculum(newData);
    };

    const handleMoveTopic = (topicIndex: number, direction: -1 | 1) => {
        const newData = [...currentGradeData];
        const targetIndex = topicIndex + direction;
        
        if (targetIndex >= 0 && targetIndex < newData.length) {
            const movingTopic = newData[topicIndex];
            const targetTopic = newData[targetIndex];
            if (movingTopic.semester !== targetTopic.semester) {
                movingTopic.semester = targetTopic.semester;
            }
            const temp = newData[topicIndex];
            newData[topicIndex] = newData[targetIndex];
            newData[targetIndex] = temp;
            updateCurriculum(newData);
        }
    };

    const handleSuggestAI = async () => {
        if (!activeLesson || activeLesson.yccd.length === 0 || activeLesson.yccd.every(y => !y.trim())) {
            addToast('error', 'Vui lòng nhập Yêu cầu cần đạt trước khi sử dụng AI.');
            return;
        }

        setIsAiLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `
                Dựa trên bài học "${activeLesson.title}" (môn ${currentSubject}, khối ${currentGrade}) có các Yêu cầu cần đạt (YCCĐ) sau đây:
                ${activeLesson.yccd.map(y => `- ${y}`).join('\n')}

                Hãy phân tích kỹ các YCCĐ trên và chọn tối đa 3 mã năng lực số (NLS) phù hợp nhất từ danh sách:
                ${activeCompetencies.map(c => `${c.code}: ${c.text}`).join('\n')}

                Yêu cầu quan trọng:
                1. Mỗi "Minh chứng thực hiện" PHẢI giải thích rõ mối liên hệ trực tiếp với một hoặc nhiều YCCĐ của bài dạy.
                2. Minh chứng phải mô tả cụ thể hành động học sinh sẽ thực hiện trong bài học này để minh họa cho năng lực số đó.
                3. Bắt đầu minh chứng bằng "HS...". Độ dài khoảng 20-30 từ.
                
                Trả về kết quả dưới dạng JSON array các object có thuộc tính 'code' và 'reason'.
            `;

            const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: {
                    systemInstruction: "Bạn là chuyên gia giáo dục am hiểu khung năng lực số của Việt Nam. Bạn luôn viết minh chứng tích hợp bám sát vào mục tiêu bài dạy (YCCĐ).",
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                code: { type: Type.STRING, description: "Mã năng lực số" },
                                reason: { type: Type.STRING, description: "Minh chứng thực hiện tích hợp bám sát YCCĐ" }
                            },
                            required: ["code", "reason"]
                        }
                    }
                }
            }));

            const suggestions = JSON.parse(response.text || "[]");
            const newMappings = { ...activeLesson.mappings };

            suggestions.forEach((s: { code: string, reason: string }) => {
                if (activeCompetencies.some(c => c.code === s.code)) {
                    newMappings[s.code] = {
                        selected: true,
                        type: 'suggested',
                        reason: s.reason
                    };
                }
            });

            updateActiveLesson({ mappings: newMappings });
            addToast('success', 'AI đã hoàn thành đề xuất tích hợp NLS bám sát YCCĐ.');
        } catch (error) {
            console.error("AI Error:", error);
            addToast('error', isQuotaError(error) ? 'Đã hết hạn mức sử dụng AI. Vui lòng thử lại sau.' : 'Có lỗi xảy ra khi gọi AI.');
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleRewriteReasonWithAI = async (code: string) => {
        if (!activeLesson) return;
        const comp = activeCompetencies.find(c => c.code === code);
        if (!comp) return;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                Viết lại minh chứng tích hợp cho năng lực số "${code}: ${comp.text}" 
                trong bài dạy "${activeLesson.title}".
                Các YCCĐ của bài dạy: ${activeLesson.yccd.join('; ')}.
                Minh chứng hiện tại: "${activeLesson.mappings[code]?.reason || ''}"
                
                Yêu cầu: Giải thích cụ thể hành động của HS bám sát vào các YCCĐ đã nêu. Bắt đầu bằng "HS...". Ngắn gọn, súc tích (20-30 từ).
            `;

            const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    systemInstruction: "Bạn là một chuyên gia viết giáo án, chuyên môn hóa trong việc viết minh chứng năng lực số bám sát mục tiêu bài học.",
                }
            }));

            if (response.text) {
                const newM = { ...activeLesson.mappings };
                if (newM[code]) {
                    newM[code].reason = response.text.trim();
                    updateActiveLesson({ mappings: newM });
                    addToast('success', `Đã cập nhật minh chứng bám sát YCCĐ cho ${code}`);
                }
            }
        } catch (error) {
            console.error("AI Rewrite Error:", error);
            addToast('error', 'Không thể viết lại minh chứng bằng AI.');
        }
    };

    const handleExportWord = () => {
        const title = viewMode === 'pl1' ? "Phu_luc_1_Ke_hoach_NLS" : viewMode === 'pl3' ? "Phu_luc_3_Ke_hoach_Day_hoc" : "Phu_luc_4_Ke_hoach_Bai_day";
        const orientation = viewMode === 'pl4' ? 'portrait' : 'landscape';
        const pageSize = orientation === 'landscape' ? '29.7cm 21cm' : '21cm 29.7cm';
        
        let htmlContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset="utf-8"><title>${title}</title>
            <style>
                @page Section1 { size: ${pageSize}; mso-page-orientation: ${orientation}; margin: 1.5cm; }
                div.Section1 { page:Section1; }
                body { font-family: 'Times New Roman', serif; }
                table { border-collapse: collapse; width: 100%; border: 1px solid black; }
                th, td { border: 1px solid black; padding: 6px; vertical-align: top; font-size: 11pt; }
                .semester-header { background: #f8fafc; font-weight: bold; text-align: center; font-size: 13pt; border: 2px solid black; }
                .topic-header { background: #f1f5f9; font-weight: bold; }
            </style></head><body><div class="Section1">
            <h2 style="text-align:center; text-transform:uppercase;">${title.replace(/_/g, ' ')}</h2>
            <h3 style="text-align:center;">Môn: ${currentSubject} - Khối: ${currentGrade}</h3>
        `;

        if (viewMode === 'pl3') {
            htmlContent += `<table><thead><tr><th>STT</th><th>Bài học</th><th>Số tiết</th><th>Thời điểm</th><th>Thiết bị dạy học</th><th>Địa điểm</th><th>NLS Tích hợp</th></tr></thead><tbody>`;
            [1, 2].forEach(sem => {
                htmlContent += `<tr><td colspan="7" class="semester-header">HỌC KỲ ${sem === 1 ? 'I' : 'II'}</td></tr>`;
                let stt = 1;
                currentGradeData.filter(t => (t.semester || 1) === sem).forEach(topic => {
                    htmlContent += `<tr><td colspan="7" class="topic-header">${topic.topic}</td></tr>`;
                    topic.lessons.forEach(l => {
                        const codes = Object.keys(l.mappings || {}).join(', ');
                        htmlContent += `<tr><td style="text-align:center;">${stt++}</td><td>${l.title}</td><td style="text-align:center;">1</td><td>-</td><td>${l.equipment || 'Máy tính, máy chiếu'}</td><td>${l.location || 'Phòng Tin học'}</td><td>${codes}</td></tr>`;
                    });
                });
            });
            htmlContent += `</tbody></table>`;
        } else if (viewMode === 'pl4' && activeLesson) {
            htmlContent += `
                <h4>Tên bài dạy: ${activeLesson.title}</h4>
                <p><b>I. Mục tiêu:</b> ${activeLesson.yccd.map(y => `<br>- ${y}`).join('')}</p>
                <p><b>II. Thiết bị:</b> ${activeLesson.equipment || 'Máy tính, máy chiếu'}</p>
                <p><b>III. Tiến trình:</b></p>
                ${Object.keys(activeLesson.mappings || {}).map(code => `
                    <div style="background:#f0f9ff; border:1px solid #0ea5e9; padding:10px; margin-bottom:10px;">
                        <b>TÍCH HỢP NLS: ${code}</b><br>
                        ${activeLesson.mappings[code].reason}
                    </div>
                `).join('')}
            `;
        }

        htmlContent += `</div></body></html>`;
        const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${title}_${currentSubject}_L${currentGrade}.doc`;
        link.click();
        addToast('success', 'Đã xuất file Word thành công!');
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden font-sans text-sm text-slate-700 bg-slate-100">
            <Header 
                currentGrade={currentGrade} setGrade={setGrade} 
                currentSubject={currentSubject} setSubject={setSubject}
                viewMode={viewMode} setViewMode={setViewMode}
                onExportWord={handleExportWord}
                onExportJson={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullData, null, 2));
                    const link = document.createElement('a');
                    link.setAttribute("href", dataStr);
                    link.setAttribute("download", `EduPlan_Full_Backup.json`);
                    link.click();
                }}
            />
            
            <div className="flex flex-grow overflow-hidden relative">
                <Sidebar 
                    topics={currentGradeData} currentLessonId={currentLessonId}
                    onSelectLesson={setCurrentLessonId}
                    onAddLesson={() => {
                         const newData = [...currentGradeData];
                         if (newData.length === 0) newData.push({ topic: "Chủ đề 1", semester: 1, lessons: [] });
                         const newLesson = { id: Date.now(), title: "Bài học mới", yccd: [""], mappings: {}, equipment: "Máy tính, máy chiếu", location: "Phòng Tin học" };
                         newData[0].lessons.push(newLesson);
                         updateCurriculum(newData);
                         setCurrentLessonId(newLesson.id);
                    }}
                    onAddTopic={() => {
                         const newData = [...currentGradeData, { topic: "Chủ đề mới", semester: 1, lessons: [] }];
                         updateCurriculum(newData);
                    }}
                    onDeleteLesson={(id) => {
                         const newData = currentGradeData.map(t => ({ ...t, lessons: t.lessons.filter(l => l.id !== id) }));
                         updateCurriculum(newData);
                    }}
                    onMoveLesson={handleMoveLesson}
                    onMoveTopic={handleMoveTopic}
                    onReorderLesson={handleReorderLesson}
                />
                
                <main className="flex-grow overflow-y-auto custom-scroll p-6 bg-slate-50 relative">
                    <button 
                        onClick={handleResetToDefaults}
                        className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-bold transition shadow-sm"
                    >
                        <RotateCcw size={14} /> Khôi phục mẫu
                    </button>

                    {activeLesson ? (
                        <>
                            {viewMode === 'pl1' && (
                                <CompetencyTable 
                                    lesson={activeLesson} competencies={activeCompetencies} currentSubject={currentSubject}
                                    filterMode={filterMode} onToggleFilter={() => setFilterMode(!filterMode)}
                                    topicName={context?.topic.topic || ""} isAiLoading={isAiLoading}
                                    allLessonsInGrade={allLessonsInGrade}
                                    usageMap={globalUsageMap}
                                    onUpdateTitle={(t) => updateActiveLesson({ title: t })}
                                    onUpdateTopic={(t) => {
                                        const newData = [...currentGradeData];
                                        newData[context!.topicIndex].topic = t;
                                        updateCurriculum(newData);
                                    }}
                                    onUpdateYCCD={(i, t) => {
                                        const newY = [...activeLesson.yccd];
                                        newY[i] = t;
                                        updateActiveLesson({ yccd: newY });
                                    }}
                                    onBulkUpdateYCCD={(y) => updateActiveLesson({ yccd: y })}
                                    onAddYCCD={() => updateActiveLesson({ yccd: [...activeLesson.yccd, ""] })}
                                    onDeleteYCCD={(i) => {
                                        const newY = [...activeLesson.yccd];
                                        newY.splice(i, 1);
                                        updateActiveLesson({ yccd: newY });
                                    }}
                                    onMappingChange={(c, s) => {
                                        const newM = { ...activeLesson.mappings };
                                        if (s) newM[c] = { selected: true, type: 'manual', reason: '' };
                                        else delete newM[c];
                                        updateActiveLesson({ mappings: newM });
                                    }}
                                    onReasonChange={(c, r) => {
                                        const newM = { ...activeLesson.mappings };
                                        if (newM[c]) newM[c].reason = r;
                                        updateActiveLesson({ mappings: newM });
                                    }}
                                    onSuggestAI={handleSuggestAI}
                                    onRewriteReasonWithAI={handleRewriteReasonWithAI}
                                    onSplitLesson={() => {}} onMergeNext={() => {}} onMergePrevious={() => {}}
                                    canMergeNext={false} canMergePrevious={false}
                                    referenceITData={referenceITData}
                                />
                            )}
                            {viewMode === 'pl3' && (
                                <ScheduleTable 
                                    topics={currentGradeData} 
                                    competencies={activeCompetencies}
                                    onUpdateLesson={(lessonId, updates) => {
                                        const newData = currentGradeData.map(t => ({
                                            ...t,
                                            lessons: t.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
                                        }));
                                        updateCurriculum(newData);
                                    }}
                                />
                            )}
                            {viewMode === 'pl4' && (
                                <LessonPlanDoc 
                                    lesson={activeLesson}
                                    competencies={activeCompetencies}
                                />
                            )}
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 italic">
                            Chọn một bài học từ danh mục bên trái để bắt đầu lập kế hoạch.
                        </div>
                    )}
                </main>
            </div>
            
            <Toast toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
        </div>
    );
}

export default App;
