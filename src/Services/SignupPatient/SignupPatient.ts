import axios from 'axios';
import type Patient from "../../Types/Patient";

interface SignupResponse {
  success: boolean;
  message: string;
  data?: Patient;
}

export const signupPatient = async (patientData: Omit<Patient, "id" | "Ordonnance">): Promise<SignupResponse> => {
  try {
    const newPatient = {
        ...patientData,
        id: Math.floor(Math.random() * 1000000),
      Ordonnance: []
    };

    const response = await axios.post('http://localhost:3000/patients', newPatient);

    console.log("Nouveau patient créé:", response.data);

    return {
      success: true,
      message: "Patient créé avec succès",
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