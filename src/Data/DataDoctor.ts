import Doctor from "../Types/Doctor";

const DataDoctor: Doctor[] = [
    {
        id: 1,
        noms: "Dr. Patrick Dubois",
        sexe: "Masculin", 
        phone: "0712345678",
        email: "patrick@gmail.com",
        password: "12345",
        adresse: "15 rue du Docteur, Paris",
        specialite: "Cardiologue",
        description: "Spécialiste en cardiologie interventionnelle",
        diagnosticPatient: [
            {
                patientId: 1, 
                patientName: "kol",
                date: "12/10/2024",
                symptoms: "Maux de tête, fièvre",
                status: "en_attente"

            },
            {
                patientId: 2, 
                patientName: "Ken",
                date: "12/10/2024",
                symptoms: "Maux de tête, fièvre",
                status: "traité"

            },

        ]
    },
    {
        id: 2,
        noms: "Dr. Sophie Laurent",
        sexe: "Féminin", 
        phone: "0723456789",
        email: "sophie.laurent@gmail.com",
        password: "12345",
        adresse: "28 avenue Foch, Paris",
        specialite: "Pédiatre",
        description: "Spécialiste en pédiatrie générale et néonatologie",
        diagnosticPatient: [

            {
                patientId: 1, 
                patientName: "kol",
                date: "12/10/2024",
                symptoms: "Maux de tête, fièvre",
                status: "en_attente"

            },
            {
                patientId: 2, 
                patientName: "Ken",
                date: "12/10/2024",
                symptoms: "Maux de tête, fièvre",
                status: "traité"

            },
        ]
    },
    {
        id: 3,
        noms: "Dr. Marc Petit",
        sexe: "Masculin", 
        phone: "0734567890",
        email: "marc.petit@gmail.com",
        password: "12345",
        adresse: "92 boulevard Haussmann, Paris",
        specialite: "Dermatologue",
        description: "Expert en dermatologie esthétique et médicale",
        diagnosticPatient: []
    },
    {
        id: 4,
        noms: "Dr. Laura Martin",
        sexe: "Féminin", 
        phone: "0745678901",
        email: "laura.martin@gmail.com",
        password: "12345",
        adresse: "10 rue de la Paix, Lyon",
        specialite: "Gynécologue",
        description: "Spécialiste en gynécologie obstétrique",
        diagnosticPatient: []
    },
    {
        id: 5,
        noms: "Dr. Jean Dupont",
        sexe: "Masculin", 
        phone: "0756789012",
        email: "jean.dupont@gmail.com",
        password: "12345",
        adresse: "45 avenue des Champs-Élysées, Paris",
        specialite: "Gynécologue",
        description: "Chirurgien orthopédiste spécialisé en traumatologie",
        diagnosticPatient: []
    },
    {
        id: 6,
        noms: "Dr. Alice Moreau",
        sexe: "Féminin", 
        phone: "0767890123",
        email: "alice.moreau@gmail.com",
        password: "12345",
        adresse: "33 rue de Rivoli, Marseille",
        specialite: "Neurologue",
        description: "Experte en neurologie et troubles du sommeil",
        diagnosticPatient: []
    },
    {
        id: 7,
        noms: "Dr. Thomas Leroy",
        sexe: "Masculin", 
        phone: "0778901234",
        email: "thomas.leroy@gmail.com",
        password: "12345",
        adresse: "22 rue de la République, Lille",
        specialite: "Psychiatre",
        description: "Spécialiste en psychiatrie adulte et thérapies cognitives",
        diagnosticPatient: []
    },
    {
        id: 8,
        noms: "Dr. Camille Blanc",
        sexe: "Féminin", 
        phone: "0789012345",
        email: "camille.blanc@gmail.com",
        password: "12345",
        adresse: "5 rue de la Liberté, Bordeaux",
        specialite: "Cardiologue",
        description: "Spécialiste en diabétologie et maladies métaboliques",
        diagnosticPatient: []
    },
    {
        id: 9,
        noms: "Dr. Nicolas Lambert",
        sexe: "Masculin", 
        phone: "0790123456",
        email: "nicolas.lambert@gmail.com",
        password: "12345",
        adresse: "14 rue de la Gare, Toulouse",
        specialite: "Dermatologue",
        description: "Expert en imagerie médicale et radiologie interventionnelle",
        diagnosticPatient: []
    },
    {
        id: 10,
        noms: "Dr. Élodie Garnier",
        sexe: "Féminin", 
        phone: "0701234567",
        email: "elodie.garnier@gmail.com",
        password: "12345",
        adresse: "7 rue des Fleurs, Nice",
        specialite: "Ophtalmologue",
        description: "Spécialiste en chirurgie réfractive et glaucome",
        diagnosticPatient: []
    }
];

export default DataDoctor;