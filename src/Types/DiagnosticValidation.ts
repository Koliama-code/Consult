import Patient from "./Patient";

interface TypeDiagnostic {
    id: number;
    patient: Patient;
    symptoms: string;
    date: string;
    diagnostic: string;
    validation: boolean;
    specialiste?: string;
    commentaire?: string;
}

export default TypeDiagnostic;
