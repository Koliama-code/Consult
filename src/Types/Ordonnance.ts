type Ordonnance = {
    id: number;
    date: string;
    PatientName: string; 
    phone: string;
    email: string;
    symptoms:string;
    DoctorName:string;
    nomMedicament: string; // Nom du médicament (DCI ou nom commercial)
    forme: string; // Forme pharmaceutique (comprimé, sirop, etc.)
    dosage: string; // Dosage (ex : 500 mg, 10 mg/mL)
    posologie: string; // Instructions (ex : 1 comprimé, 3 fois par jour)
    duree: string; // Durée du traitement (ex : 7 jours)
  };
  export default Ordonnance;