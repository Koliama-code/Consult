import axios from 'axios';
import Patient from "../../Types/Patient";
import Ordonnance from "../../Types/Ordonnance";
export const getPatientFromOrdonnance = async (ordonnance: Ordonnance): Promise<Patient | null> => {
    try {
        const response = await axios.get('http://localhost:3000/patients');
        const patients= response.data;
        
        const patient:Patient = patients.find(
            (p: Patient) => p.email === ordonnance.email && p.phone === ordonnance.phone
        );

        if (!patient) {
            console.log(`Aucun patient trouvé pour l'ordonnance de ${ordonnance.PatientName}`);
            return null;
        }

        const newId = patient.Ordonnance.length > 0 
            ? Math.max(...patient.Ordonnance.map((o) => o.id)) + 1 
            : 1;

        // Update the patient with the new ordonnance
        patient.Ordonnance.push({
            ...ordonnance,
            id: newId
        });

        // Save the updated patient back to db.json
        await axios.put(`http://localhost:3000/patients/${patient.id}`, patient);

        console.log(`Jeremie`, patient);
        
        return patient;
    } catch (error) {
        console.error('Erreur lors de la recherche du patient:', error);
        return null;
    }
};