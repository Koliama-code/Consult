import Patient from "../Types/Patient";

const DataPatient : Patient[] = [
    {
        id: 1,
        noms: "Jean Dupont",
        sexe: "Masculin",
        phone: "0765432109",
        email: "jean.dupont@gmail.com",
        password: "12345",
        adresse: "123 rue de la Paix, Paris",
        age: 35,
        Ordonnance: [{ id: 1,
            date: "2023-01-01",
            PatientName: "Jean Dupont",
            phone: "0765432109",
            email: "jean.dupont@gmail.com",
            symptoms: "Fevrier",
            DoctorName: "Dr. Dupont",
            nomMedicament: "Paracétamol",
            forme: "Comprimé",
            dosage: "500 mg",
            posologie: "1 comprimé par jour",
            duree: "7 jours"
        },
        { id: 2,
            date: "2023-01-01",
            PatientName: "Jean Dupont",
            phone: "0765432109",
            email: "jean.dupont@gmail.com",
            symptoms: "Fevrier",
            DoctorName: "Dr. Dupont",
            nomMedicament: "Paracétamol",
            forme: "Comprimé",
            dosage: "500 mg",
            posologie: "1 comprimé par jour",
            duree: "7 jours"
        }]
    },
    {
        id: 2,
        noms: "Marie Martin",
        sexe: "Féminin",
        phone: "0745678910",
        email: "marie@gmail.com",
        password: "12345",
        adresse: "45 avenue des Champs-Élysées, Paris",
        age: 28,
        Ordonnance: [{ id: 1,
            date: "2023-01-01",
            PatientName: "Martin",
            phone: "0745678912",
            email: "martin@gmail.com",
            symptoms: "Fevrier",
            DoctorName: "Dr. Martin",
            nomMedicament: "Paracétamol",
            forme: "Comprimé",
            dosage: "500 mg",
            posologie: "1 comprimé par jour",
            duree: "7 jours"
        }]
    },
    {
        id: 3,
        noms: "Pierre Bernard",
        sexe: "Masculin",
        phone: "0789012345",
        email: "pierre.bernard@gmail.com",
        password: "12345",
        adresse: "78 boulevard Saint-Michel, Paris",
        age: 42,
        Ordonnance: []
    }
];

export default DataPatient;