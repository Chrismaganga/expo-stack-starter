/* eslint-disable import/order */
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Resume {
  id: string;
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
  profileSummary: string;
  
  // Professional Details
  jobTitle: string;
  companyName?: string;
  github?: string;
  linkedIn?: string;
  portfolio?: string;
  
  // Collections
  education: Education[];
  workExperience: WorkExperience[];
  skills: Skill[];
  languages: {
    [x: string]: Key | null | undefined; language: string; proficiency: string 
}[];
  certifications: string[];
  
  // Meta
  createdAt: string;
  updatedAt: string;
}

interface ResumeState {
  resumes: Resume[];
  currentResume: Resume | null;
  addResume: (resume: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateResume: (id: string, resume: Partial<Resume>) => void;
  deleteResume: (id: string) => void;
  setCurrentResume: (resume: Resume | null) => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  resumes: [],
  currentResume: null,
  
  addResume: (resumeData) => {
    const newResume: Resume = {
      ...resumeData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    set((state) => ({
      resumes: [...state.resumes, newResume],
      currentResume: newResume,
    }));
  },
  
  updateResume: (id, resumeData) => {
    set((state) => ({
      resumes: state.resumes.map((resume) =>
        resume.id === id
          ? { ...resume, ...resumeData, updatedAt: new Date().toISOString() }
          : resume
      ),
      currentResume:
        state.currentResume?.id === id
          ? { ...state.currentResume, ...resumeData, updatedAt: new Date().toISOString() }
          : state.currentResume,
    }));
  },
  
  deleteResume: (id) => {
    set((state) => ({
      resumes: state.resumes.filter((resume) => resume.id !== id),
      currentResume: state.currentResume?.id === id ? null : state.currentResume,
    }));
  },
  
  setCurrentResume: (resume) => {
    set({ currentResume: resume });
  },
}));
