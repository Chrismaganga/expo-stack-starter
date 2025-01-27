/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface CoverLetter {
  id: string;
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  
  // Job Details
  companyName: string;
  jobTitle: string;
  hiringManager?: string;
  
  // Letter Content
  greeting: string;
  introduction: string;
  body: string;
  conclusion: string;
  signature: string;
  
  // Meta
  createdAt: string;
  updatedAt: string;
}

interface CoverLetterState {
  coverLetters: CoverLetter[];
  currentCoverLetter: CoverLetter | null;
  addCoverLetter: (coverLetter: Omit<CoverLetter, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCoverLetter: (id: string, coverLetter: Partial<CoverLetter>) => void;
  deleteCoverLetter: (id: string) => void;
  setCurrentCoverLetter: (coverLetter: CoverLetter | null) => void;
}

export const useCoverLetterStore = create<CoverLetterState>((set) => ({
  coverLetters: [],
  currentCoverLetter: null,
  
  addCoverLetter: (coverLetterData) => {
    const newCoverLetter: CoverLetter = {
      ...coverLetterData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    set((state) => ({
      coverLetters: [...state.coverLetters, newCoverLetter],
      currentCoverLetter: newCoverLetter,
    }));
  },
  
  updateCoverLetter: (id, coverLetterData) => {
    set((state) => ({
      coverLetters: state.coverLetters.map((letter) =>
        letter.id === id
          ? { ...letter, ...coverLetterData, updatedAt: new Date().toISOString() }
          : letter
      ),
      currentCoverLetter:
        state.currentCoverLetter?.id === id
          ? { ...state.currentCoverLetter, ...coverLetterData, updatedAt: new Date().toISOString() }
          : state.currentCoverLetter,
    }));
  },
  
  deleteCoverLetter: (id) => {
    set((state) => ({
      coverLetters: state.coverLetters.filter((letter) => letter.id !== id),
      currentCoverLetter: state.currentCoverLetter?.id === id ? null : state.currentCoverLetter,
    }));
  },
  
  setCurrentCoverLetter: (coverLetter) => {
    set({ currentCoverLetter: coverLetter });
  },
}));
