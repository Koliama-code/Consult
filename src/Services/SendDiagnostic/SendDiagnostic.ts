import { User } from 'lucide-react';
import axios from 'axios';
import { Doctor, PatientDiagnostic } from "../../Types/Doctor";
import Patient from "../../Types/Patient";

interface DiagnosticRequest {
    symptoms: string;
    specialiste: string;
}

export const findSpecialist = async (diagnostic: DiagnosticRequest): Promise<Doctor | null> => {
    try {
        // Get patient info from localStorage
        const patient = JSON.parse(localStorage.getItem('user') || '{}');
        
        const response = await axios.get('http://localhost:3000/doctors');
        const doctors = response.data;

        // Extract all possible specialties from the diagnostic symptoms
        const possibleSpecialties = diagnostic.symptoms
            .toLowerCase()
            .split(/[,.]/)
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log('Possible specialties from diagnostic:', possibleSpecialties);

        // Find doctors matching any of the possible specialties
        const specialists = doctors.filter((doctor: Doctor) => {
            const doctorSpeciality = doctor.specialite.toLowerCase().trim();
            
            // Check if doctor's specialty matches any of the possible specialties
            return possibleSpecialties.some(specialty => 
                doctorSpeciality.includes(specialty) || 
                specialty.includes(doctorSpeciality) ||
                doctorSpeciality === "generaliste"
            );
        });

        console.log('Found matching specialists:', specialists);

        if (specialists.length === 0) {
            // Fallback to general practitioners if no specialist found
            const generalistes = doctors.filter(
                (doctor: Doctor) => doctor.specialite.toLowerCase().includes("general")
            );
            
            if (generalistes.length > 0) {
                const selectedDoctor = generalistes[Math.floor(Math.random() * generalistes.length)];
                await saveDiagnostic(selectedDoctor, diagnostic,patient);
                return selectedDoctor;
            }
            return null;
        }

        // Select random specialist from matches
        const selectedDoctor = specialists[Math.floor(Math.random() * specialists.length)];
        await saveDiagnostic(selectedDoctor, diagnostic, patient);
        return selectedDoctor;

    } catch (error) {
        console.error('Erreur lors de la recherche du spécialiste:', error);
        return null;
    }
};

// Helper function to save diagnostic information
async function saveDiagnostic(doctor: Doctor, diagnostic: DiagnosticRequest, patient: any) {
    // Create diagnostic object with connected patient info
    const newDiagnostic: PatientDiagnostic = {
        patientId: patient.id,
        patientName: patient.noms,
        date: new Date().toLocaleDateString(),
        symptoms: diagnostic.symptoms,
        status: "en_attente"
    };

    // Add diagnostic to doctor's list
    doctor.diagnosticPatient.push(newDiagnostic);

    // Update doctor in database
    await axios.patch(`http://localhost:3000/doctors/${doctor.id}`, doctor);

    // Add diagnostic to diagnostics table
    await axios.post('http://localhost:3000/diagnostics', {
        id: Date.now().toString(),
        patientId: patient.id,
        patientName: patient.noms,
        date: new Date().toLocaleDateString(),
        symptoms: diagnostic.symptoms,
        status: "en_attente"
    });
}

export default findSpecialist;