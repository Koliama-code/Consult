import axios from "axios";
import { Doctor, PatientDiagnostic } from "../../Types/Doctor";
import Patient from "../../Types/Patient";

interface DiagnosticRequest {
  symptoms: string;
  specialiste: string;
  patient: Patient;
}

export const findSpecialist = async (
  diagnostic: DiagnosticRequest
): Promise<Doctor | null> => {
  try {
    const response = await axios.get("http://localhost:3000/doctors");
    const doctors = response.data;

    // Get all available specialties from the database
    const availableSpecialties = [...new Set(doctors.map((doc: Doctor) => 
      doc.specialite.toLowerCase()
    ))];
    console.log("Available specialties:", availableSpecialties);

    // Split the diagnostic text and search for matching specialties
    const words = diagnostic.symptoms.toLowerCase().split(/\s+/);
    let matchedSpecialty = null;

    for (const specialty of availableSpecialties) {
      if (words.some(word => word.includes(specialty) || specialty.includes(word))) {
        matchedSpecialty = specialty;
        break;
      }
    }

    if (!matchedSpecialty) {
      console.log("Aucune correspondance trouvée avec nos spécialités disponibles");
      return null;
    }

    // Find doctors with matching specialty
    const specialists = doctors.filter((doctor: Doctor) =>
      doctor.specialite.toLowerCase() === matchedSpecialty
    );

    if (specialists.length === 0) {
      console.log(`Aucun médecin disponible pour la spécialité: ${matchedSpecialty}`);
      return null;
    }

    // Select a random doctor
    const randomIndex = Math.floor(Math.random() * specialists.length);
    const selectedDoctor = specialists[randomIndex];

    // Create diagnostic object and continue with existing code...
    const newDiagnostic: PatientDiagnostic = {
      patientId: diagnostic.patient.id,
      patientName: diagnostic.patient.noms,
      date: new Date().toLocaleDateString(),
      symptoms: diagnostic.symptoms,
      status: "en_attente",
    };

    // Ajouter le diagnostic à la liste des diagnostics du médecin
    selectedDoctor.diagnosticPatient.push(newDiagnostic);

    // Mettre à jour le médecin dans la base de données
    await axios.patch(
      `http://localhost:3000/doctors/${selectedDoctor.id}`,
      selectedDoctor
    );

    // Ajouter le diagnostic dans la table diagnostics
    await axios.post("http://localhost:3000/diagnostics", {
      id: Date.now().toString(),
      patientId: diagnostic.patient.id,
      patientName: diagnostic.patient.noms,
      date: new Date().toLocaleDateString(),
      symptoms: diagnostic.symptoms,
      status: "en_attente",
    });

    return selectedDoctor;
  } catch (error) {
    console.error("Erreur lors de la recherche du spécialiste:", error);
    return null;
  }
};

export default findSpecialist;
