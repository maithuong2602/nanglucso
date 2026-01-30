
import React, { useState, useEffect } from 'react';
import { Lesson, Competency, Subject, Grade, LessonSection, LessonStep } from '../types';
import { Sparkles, Wand2, RefreshCw, LayoutTemplate, BrainCircuit, Plus, Trash2, MoveUp, MoveDown, Save, Edit3, Upload, Check, X, GripVertical, Clock } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import LoadingOverlay from './LoadingOverlay';

interface LessonPlanDocProps {
    lesson: Lesson;
    competencies: Competency[];
    currentSubject: Subject;
    currentGrade: Grade;
    onUpdateLesson: (updates: Partial<Lesson>) => void;
}

const DEFAULT_SECTIONS: LessonSection[] = [
    { id: 'sec_1', label: 'A', title: 'HOẠT ĐỘNG KHỞI ĐỘNG', objective: '', content: '', product: '', steps: [
        { id: 's1', title: 'Bước 1: Chuyển giao nhiệm vụ', content: '' },
        { id: 's2', title: 'Bước 2: Thực hiện nhiệm vụ', content: '' },
        { id: 's3', title: 'Bước 3: Báo cáo, thảo luận', content: '' },
        { id: 's4', title: 'Bước 4: Kết luận, nhận định', content: '' }
    ]},
    { id: 'sec_2', label: 'B', title: 'HOẠT ĐỘNG HÌNH THÀNH KIẾN THỨC', objective: '', content: '', product: '', steps: [
        { id: 's1', title: 'Bước 1: Chuyển giao nhiệm vụ', content: '' },
        { id: 's2', title: 'Bước 2: Thực hiện nhiệm vụ', content: '' },
        { id: 's3', title: 'Bước 3: Báo cáo, thảo luận', content: '' },
        { id: 's4', title: 'Bước 4: Kết luận, nhận định', content: '' }
    ]},
    { id: 'sec_3', label: 'C', title: 'HOẠT ĐỘNG LUYỆN TẬP', objective: '', content: '', product: '', steps: [
        { id: 's1', title: 'Bước 1: Chuyển giao nhiệm vụ', content: '' },
        { id: 's2', title: 'Bước 2: Thực hiện nhiệm vụ', content: '' },
        { id: 's3', title: 'Bước 3: Báo cáo, thảo luận', content: '' },
        { id: 's4', title: 'Bước 4: Kết luận, nhận định', content: '' }
    ]},
    { id: 'sec_4', label: 'D', title: 'HOẠT ĐỘNG VẬN DỤNG', objective: '', content: '', product: '', steps: [
        { id: 's1', title: 'Bước 1: Chuyển giao nhiệm vụ', content: '' },
        { id: 's2', title: 'Bước 2: Thực hiện nhiệm vụ', content: '' },
        { id: 's3', title: 'Bước 3: Báo cáo, thảo luận', content: '' },
        { id: 's4', title: 'Bước 4: Kết luận, nhận định', content: '' }
    ]}
];

const LessonPlanDoc: React.FC<LessonPlanDocProps> = ({ 
    lesson, competencies, currentSubject, currentGrade, onUpdateLesson 
}) => {
    const [sections, setSections] = useState<LessonSection[]>(lesson.planData || DEFAULT_SECTIONS);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadContent, setUploadContent] = useState('');
    const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

    // Sync state when lesson prop changes
    useEffect(() => {
        if (lesson.planData) {
            setSections(lesson.planData);
        } else {
            // If no planData but has legacy activities, we might want to keep using default for now or try to parse
            setSections(DEFAULT_SECTIONS);
        }
    }, [lesson.id]);

    const handleSaveSections = (newSections: LessonSection[]) => {
        setSections(newSections);
        onUpdateLesson({ planData: newSections });
    };

    const periods = lesson.periods || 1;
    const totalMinutes = periods * 45;

    const selectedCodes = Object.keys(lesson.mappings || {}).filter(c => lesson.mappings[c].selected);
    const getCompText = (code: string) => competencies.find(c => c.code === code)?.text || '';
    const getCompReason = (code: string) => lesson.mappings[code]?.reason || '';
    
    const nlsDescriptionList = selectedCodes.map(code => 
        `- ${code}: ${getCompText(code)} (Minh chứng: ${getCompReason(code)})`
    ).join('\n');

    // AI Feature: Generate Structured Plan
    const handleGenerateAI = async () => {
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `
                Đóng vai trò GV môn ${currentSubject}. Soạn KHBD bài "${lesson.title}" (${periods} tiết).
                YCCĐ: ${lesson.yccd.join('; ')}
                Năng lực số tích hợp: ${nlsDescriptionList}

                Trả về JSON (không Markdown) danh sách các hoạt động theo cấu trúc:
                [
                    {
                        "id": "unique_string",
                        "label": "A", 
                        "title": "HOẠT ĐỘNG KHỞI ĐỘNG",
                        "duration": 10,
                        "objective": "...",
                        "content": "...",
                        "product": "...",
                        "steps": [
                            {"id": "s1", "title": "Bước 1: GV chuyển giao...", "content": "...", "nlsCodes": []},
                            {"id": "s2", "title": "Bước 2: HS thực hiện...", "content": "...", "nlsCodes": ["Mã NLS nếu có"]}
                        ]
                    },
                    ... (Tiếp tục với B, C, D)
                ]
                Đảm bảo có đủ 4 hoạt động chính: A. Khởi động, B. Hình thành kiến thức, C. Luyện tập, D. Vận dụng.
                Phân bổ NLS vào các bước phù hợp (thường là bước 2).
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash', 
                contents: prompt,
                 config: { responseMimeType: "application/json" }
            });

            const jsonText = response.text || "[]";
            const parsedSections = JSON.parse(jsonText);
            
            // Validate structure
            if (Array.isArray(parsedSections)) {
                handleSaveSections(parsedSections);
            } else {
                alert("AI trả về dữ liệu không đúng định dạng.");
            }
        } catch (error) {
            console.error(error);
            alert("Lỗi kết nối AI.");
        } finally {
            setIsGenerating(false);
        }
    };

    // AI Feature: Integrate from Upload
    const handleIntegrateUpload = async () => {
        if (!uploadContent.trim()) return;
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                Chuyển đổi nội dung giáo án sau thành cấu trúc JSON và tích hợp NLS.
                Bài: ${lesson.title}. NLS: ${nlsDescriptionList}
                
                Nội dung gốc: ${uploadContent}

                Output JSON Array: LessonSection[] (như trên).
                Tự động chia thành A, B, C, D, E (Về nhà).
                Chèn mã NLS vào field "nlsCodes" trong steps tương ứng.
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            
            const parsedSections = JSON.parse(response.text || "[]");
            if (Array.isArray(parsedSections)) {
                handleSaveSections(parsedSections);
                setShowUploadModal(false);
            }
        } catch (error) {
            console.error(error);
            alert("Lỗi xử lý.");
        } finally {
            setIsGenerating(false);
        }
    };

    const updateSection = (index: number, updates: Partial<LessonSection>) => {
        const newSections = [...sections];
        newSections[index] = { ...newSections[index], ...updates };
        handleSaveSections(newSections);
    };

    const updateStep = (sectionIndex: number, stepIndex: number, updates: Partial<LessonStep>) => {
        const newSections = [...sections];
        const newSteps = [...newSections[sectionIndex].steps];
        newSteps[stepIndex] = { ...newSteps[stepIndex], ...updates };
        newSections[sectionIndex].steps = newSteps;
        handleSaveSections(newSections);
    };

    const addSection = () => {
        const newId = `sec_${Date.now()}`;
        const newSec: LessonSection = {
            id: newId, label: 'NEW', title: 'HOẠT ĐỘNG MỚI', objective: '', content: '', product: '',
            steps: [
                { id: `${newId}_s1`, title: 'Bước 1: Chuyển giao', content: '' },
                { id: `${newId}_s2`, title: 'Bước 2: Thực hiện', content: '' },
                { id: `${newId}_s3`, title: 'Bước 3: Báo cáo', content: '' },
                { id: `${newId}_s4`, title: 'Bước 4: Kết luận', content: '' },
            ]
        };
        handleSaveSections([...sections, newSec]);
        setEditingSectionId(newId);
    };

    const removeSection = (index: number) => {
        if (confirm("Bạn có chắc muốn xóa hoạt động này?")) {
            const newSections = [...sections];
            newSections.splice(index, 1);
            handleSaveSections(newSections);
        }
    };

    const moveSection = (index: number, direction: -1 | 1) => {
        if ((index === 0 && direction === -1) || (index === sections.length - 1 && direction === 1)) return;
        const newSections = [...sections];
        const temp = newSections[index];
        newSections[index] = newSections[index + direction];
        newSections[index + direction] = temp;
        handleSaveSections(newSections);
    };

    return (
        <div className="bg-slate-100 h-full flex flex-col relative">
            <LoadingOverlay isVisible={isGenerating} message="AI đang cấu trúc lại bài dạy..." />

            {/* Header */}
            <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-10">
                <div>
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <LayoutTemplate size={20} className="text-teal-600"/> 
                        Thiết kế Tiến trình Dạy học (CV 5512)
                    </h3>
                    <p className="text-xs text-slate-500">Kéo thả, chỉnh sửa từng hoạt động để tùy biến giáo án.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold hover:bg-slate-50 text-slate-700">
                        <Upload size={14} /> Tải lên
                    </button>
                    <button onClick={handleGenerateAI} disabled={isGenerating} className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg text-xs font-bold hover:shadow-lg transition-all active:scale-95">
                        <BrainCircuit size={14} /> AI Soạn mới
                    </button>
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col h-[70vh]">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-bold">Tải lên KHBD thô</h3>
                            <button onClick={() => setShowUploadModal(false)}><X size={20}/></button>
                        </div>
                        <textarea 
                            className="flex-grow p-4 resize-none outline-none font-mono text-sm"
                            placeholder="Dán nội dung giáo án cũ vào đây..."
                            value={uploadContent}
                            onChange={e => setUploadContent(e.target.value)}
                        />
                        <div className="p-4 border-t bg-slate-50 flex justify-end">
                            <button onClick={handleIntegrateUpload} className="bg-teal-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Xử lý</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content: List of Sections */}
            <div className="flex-grow overflow-y-auto custom-scroll p-6 space-y-6 pb-20">
                {sections.map((section, index) => {
                    const isEditing = editingSectionId === section.id;
                    return (
                        <div key={section.id || index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
                            {/* Section Header */}
                            <div 
                                className={`p-4 flex items-center justify-between cursor-pointer border-b border-slate-100 ${isEditing ? 'bg-teal-50' : 'bg-white'}`}
                                onClick={() => setEditingSectionId(isEditing ? null : section.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-800 text-white w-8 h-8 flex items-center justify-center rounded font-bold shadow-sm">
                                        {section.label}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 uppercase text-sm">{section.title}</h4>
                                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                            <span className="flex items-center gap-1"><Clock size={12}/> {section.duration || '...'} phút</span>
                                            <span>• {section.steps.length} bước thực hiện</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                    <button onClick={() => moveSection(index, -1)} className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded"><MoveUp size={16}/></button>
                                    <button onClick={() => moveSection(index, 1)} className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded"><MoveDown size={16}/></button>
                                    <div className="w-px h-4 bg-slate-300 mx-1"></div>
                                    <button onClick={() => removeSection(index)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                                    <button 
                                        onClick={() => setEditingSectionId(isEditing ? null : section.id)}
                                        className={`p-1.5 rounded transition-all ${isEditing ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                                    >
                                        {isEditing ? <Check size={16}/> : <Edit3 size={16}/>}
                                    </button>
                                </div>
                            </div>

                            {/* Editor Body */}
                            {isEditing && (
                                <div className="p-6 bg-slate-50/50 space-y-6 animate-in slide-in-from-top-2 duration-300">
                                    {/* General Info */}
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Nhãn (A,B..)</label>
                                            <input 
                                                className="w-full p-2 border border-slate-300 rounded text-sm font-bold text-center"
                                                value={section.label}
                                                onChange={e => updateSection(index, { label: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-span-8">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Tên hoạt động</label>
                                            <input 
                                                className="w-full p-2 border border-slate-300 rounded text-sm font-bold"
                                                value={section.title}
                                                onChange={e => updateSection(index, { title: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Thời gian (phút)</label>
                                            <input 
                                                type="number"
                                                className="w-full p-2 border border-slate-300 rounded text-sm"
                                                value={section.duration || ''}
                                                onChange={e => updateSection(index, { duration: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                    </div>

                                    {/* Content Fields */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">a) Mục tiêu:</label>
                                            <textarea 
                                                className="w-full p-3 border border-slate-300 rounded-lg text-sm h-20 focus:border-teal-500 outline-none"
                                                value={section.objective}
                                                onChange={e => updateSection(index, { objective: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">b) Nội dung:</label>
                                                <textarea 
                                                    className="w-full p-3 border border-slate-300 rounded-lg text-sm h-24 focus:border-teal-500 outline-none"
                                                    value={section.content}
                                                    onChange={e => updateSection(index, { content: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">c) Sản phẩm:</label>
                                                <textarea 
                                                    className="w-full p-3 border border-slate-300 rounded-lg text-sm h-24 focus:border-teal-500 outline-none"
                                                    value={section.product}
                                                    onChange={e => updateSection(index, { product: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Steps */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">d) Tổ chức thực hiện:</label>
                                        <div className="space-y-3 pl-4 border-l-2 border-slate-200">
                                            {section.steps.map((step, sIdx) => (
                                                <div key={step.id || sIdx} className="bg-white border border-slate-200 rounded p-3 shadow-sm group">
                                                    <div className="flex justify-between mb-2">
                                                        <input 
                                                            className="font-bold text-xs text-teal-700 bg-transparent outline-none w-1/2"
                                                            value={step.title}
                                                            onChange={e => updateStep(index, sIdx, { title: e.target.value })}
                                                        />
                                                        <div className="flex gap-2">
                                                            {step.nlsCodes && step.nlsCodes.length > 0 && (
                                                                <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                                                                    <Sparkles size={10}/> {step.nlsCodes.join(', ')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <textarea 
                                                        className="w-full text-sm text-slate-600 border-none outline-none resize-none bg-transparent"
                                                        rows={2}
                                                        value={step.content}
                                                        onChange={e => updateStep(index, sIdx, { content: e.target.value })}
                                                        placeholder="Nhập nội dung bước..."
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                <button 
                    onClick={addSection}
                    className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 hover:border-teal-500 hover:text-teal-600 font-bold flex flex-col items-center justify-center gap-2 transition-all"
                >
                    <Plus size={24}/> Thêm hoạt động mới
                </button>
            </div>
        </div>
    );
};

export default LessonPlanDoc;
