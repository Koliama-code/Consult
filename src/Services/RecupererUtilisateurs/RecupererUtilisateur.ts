import Admin from '../../Types/Admin';
import axios from 'axios';
import Patient from '../../Types/Patient';
import Doctor from '../../Types/Doctor';


const API_URL = 'http://localhost:3000';

export interface UserCredentials {
    email: string;
    password: string;
}

interface UserResponse {
    user: Patient | Doctor | Admin;
    role: 'patient' | 'doctor' | 'admin';
}

interface LoginResponse {
    success: boolean;
    message: string;
    data?: UserResponse;
}

// Fonction pour récupérer l'utilisateur
export const recupererUtilisateur = async (credentials: UserCredentials): Promise<UserResponse | null> => {
    try {
        // Vérifier dans la table patients
        const patientsResponse = await axios.get(`${API_URL}/patients`);
        const patient = patientsResponse.data.find((p: Patient) => 
            p.email === credentials.email && 
            p.password === credentials.password
        );

        if (patient) {
            return { user: patient, role: 'patient' };
        }

        // Vérifier dans la table doctors
        const doctorsResponse = await axios.get(`${API_URL}/doctors`);
        const doctor = doctorsResponse.data.find((d: Doctor) => 
            d.email === credentials.email && 
            d.password === credentials.password
        );

        if (doctor) {
            return { user: doctor, role: 'doctor' };
        }
           const AdminsResponse = await axios.get(`${API_URL}/admin`);
        const Admin = AdminsResponse.data.find((d: Doctor) => 
            d.email === credentials.email && 
            d.password === credentials.password
        );

        if (Admin) {
            return { user: Admin, role: 'admin' };
        }

        return null;
    } catch (error) {
        console.error('Erreur lors de la récupération:', error);
        return null;
    }
};

// Fonction de connexion
export const login = async (credentials: UserCredentials): Promise<LoginResponse> => {
    try {
        // Validation basique des champs
        if (!credentials.email || !credentials.password) {
            return {
                success: false,
                message: 'Veuillez remplir tous les champs'
            };
        }

        // Validation du format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(credentials.email)) {
            return {
                success: false,
                message: 'Format d\'email invalide'
            };
        }

        const user = await recupererUtilisateur(credentials);

        if (!user) {
            return {
                success: false,
                message: 'Email ou mot de passe incorrect'
            };
        }

        return {
            success: true,
            message: `Connexion réussie en tant que ${user.role}`,
            data: user
        };

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return {
            success: false,
            message: 'Une erreur est survenue lors de la connexion'
        };
    }
};