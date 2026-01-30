


export interface Competency {
    code: string;
    text: string;
}

export interface MappingDetail {
    selected: boolean;
    reason?: string;
    type?: 'suggested' | 'manual';
}

export interface Mappings {
    [code: string]: MappingDetail;
}

export interface LessonStep {
    id: string;
    title: string;
    content: string;
    nlsCodes?: string[];
}

export interface LessonSection {
    id: string;
    label: string; // A, B, C...
    title: string; // Tên hoạt động
    objective: string;
    content: string;
    product: string;
    steps: LessonStep[]; // 4 bước tổ chức
    duration?: number; // số phút
}

export interface Lesson {
    id: number | string;
    title: string;
    yccd: string[]; 
    mappings: Mappings;
    periods?: number;      // Số tiết
    equipment?: string;   
    location?: string;    
    objectives?: string;  
    activities?: string;  // Legacy HTML content
    planData?: LessonSection[]; // New structured content
    
    // Fields for PL2 (Appendix 2)
    host?: string; // Chủ trì
    collaborator?: string; // Phối hợp
}

export interface Topic {
    topic: string;
    lessons: Lesson[];
    semester?: 1 | 2; 
}

export interface CurriculumData {
    [grade: string]: Topic[];
}

export type Grade = "6" | "7" | "8" | "9";
export type Subject = "Tin học" | "Toán" | "Ngữ văn" | "KHTN" | "Lịch sử và Địa lí" | "GDCD" | "Công nghệ" | "Nghệ thuật" | "GDTC" | "HĐTN, HN" | "Khác";

export type ViewMode = 'pl1' | 'pl2' | 'pl3' | 'pl4';
