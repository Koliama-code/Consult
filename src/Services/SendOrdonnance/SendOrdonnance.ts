import axios from 'axios';
import Ordonnance from "../../Types/Ordonnance";

export const sendOrdonnance = async (ordonnance: Ordonnance): Promise<Ordonnance> => {
    try {
        // Send the ordonnance to the database using axios
        const response = await axios.post('http://localhost:3000/ordonnances', ordonnance);
        const savedOrdonnance = response.data;

        // Log de la nouvelle ordonnance
        console.log('Nouvelle ordonnance ajoutée:', {
            patient: savedOrdonnance.PatientName,
            docteur: savedOrdonnance.DoctorName,
            medicament: savedOrdonnance.nomMedicament,
            date: savedOrdonnance.date
        });
        
        // Log de l'ordonnance sauvegardée
        console.log('Ordonnance sauvegardée:', savedOrdonnance);

        return savedOrdonnance;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'ordonnance:', error);
        throw error;
    }
};

export default sendOrdonnance;