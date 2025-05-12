import axios from 'axios';
import doctor from '../../Types/Doctor';

interface SignupResponse {
  success: boolean;
  message: string;
  data?: doctor;
}  

export const signupDoctor = async (DoctorData: Omit<doctor, "id" | "description" | "PatientDiagnostic">): Promise<SignupResponse> => {
  try {
    const newDoctor = {
        ...DoctorData,
        id: Math.floor(Math.random() * 1000000),
      Ordonnance: []
    };

    const response = await axios.post('http://localhost:3000/doctors', newDoctor);

    console.log("Nouveau Docteur créé:", response.data);

    return {
      success: true,
      message: "Docteur créé avec succès",
      data: response.data
    };
  } catch (error) {
    console.error("Erreur lors de la création du patient:", error);
    return {
      success: false,
      message: "Erreur lors de la création du patient"
    };
  }
};