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

export interface Lesson {
    id: number | string;
    title: string;
    yccd: string[]; 
    mappings: Mappings;
    equipment?: string;   // For PL3
    location?: string;    // For PL3
    objectives?: string;  // For PL4
    activities?: string;  // For PL4
}

export interface Topic {
    topic: string;
    lessons: Lesson[];
    semester?: 1 | 2; // Added to handle HK1/HK2 separation
}

export interface CurriculumData {
    [grade: string]: Topic[];
}

export type Grade = "6" | "7" | "8" | "9";
export type Subject = "Tin học" | "Toán" | "Ngữ văn" | "KHTN" | "Lịch sử và Địa lí" | "GDCD" | "Công nghệ" | "Nghệ thuật" | "GDTC" | "HĐTN, HN" | "Khác";

export type ViewMode = 'pl1' | 'pl3' | 'pl4';