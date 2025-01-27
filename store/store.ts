/* eslint-disable prettier/prettier */
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Certificate {
  id: string;
  recipientName: string;
  courseName: string;
  completionDate: string;
  certificateNumber: string;
  issuerName: string;
  issuerTitle: string;
  issuerSignature?: string;
  grade?: string;
  duration: string;
  description: string;
  achievements: string[];
  logo?: string;
  templateStyle: 'classic' | 'modern' | 'minimal';
  accentColor: string;
  createdAt: string;
}

type CertificateInput = Omit<Certificate, 'id' | 'createdAt'>;

export interface CertificateState {
  certificates: Certificate[];
  currentCertificate: Certificate | null;
  addCertificate: (certificate: CertificateInput) => void;
  setCurrentCertificate: (certificate: Certificate) => void;
  clearCurrentCertificate: () => void;
}

export const useCertificateStore = create<CertificateState>((set) => ({
  certificates: [],
  currentCertificate: null,
  addCertificate: (certificateData: CertificateInput) => {
    const certificate: Certificate = {
      ...certificateData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    
    set((state) => ({
      certificates: [...state.certificates, certificate],
      currentCertificate: certificate,
    }));
  },
  setCurrentCertificate: (certificate: Certificate) =>
    set({ currentCertificate: certificate }),
  clearCurrentCertificate: () => set({ currentCertificate: null }),
}));
