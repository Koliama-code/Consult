export interface PatientDiagnostic {
    patientId: number;
    patientName: string;
    date: string;
    symptoms: string;
    status: 'en_attente' | 'traité';
}

type Doctor = {
    id: number;
    noms: string;
    sexe: string; 
    phone: string;
    email: string;
    password: string;
    adresse: string;
    specialite: string;
    description: string;
    diagnosticPatient: PatientDiagnostic[];
};

export type { Doctor };
export default Doctor;
