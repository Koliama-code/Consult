import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth } from '../../Config/firebase';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface AuthResponse {
  success: boolean;
  message: string;
  user?: any;
}

export const patientAuth = {
  // Inscription avec email/password
  register: async (email: string, password: string, userData: any): Promise<AuthResponse> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;

      // Créer le patient dans votre base de données
      const newPatient = {
        ...userData,
        id: uid,
        email,
        authProvider: 'email'
      };

      const response = await axios.post('http://localhost:3000/patients', newPatient);

      return {
        success: true,
        message: 'Inscription réussie',
        user: response.data
      };
    } catch (error: any) {
      const message = error.code === 'auth/email-already-in-use' 
        ? 'Cet email est déjà utilisé'
        : "Erreur lors de l'inscription";
      return { success: false, message };
    }
  },

  // Connexion avec email/password
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Récupérer les données du patient depuis votre base de données
      const response = await axios.get(`http://localhost:3000/patients?email=${email}`);
      const patient = response.data[0];

      if (!patient) {
        throw new Error('Patient non trouvé');
      }

      return {
        success: true,
        message: 'Connexion réussie',
        user: patient
      };
    } catch (error: any) {
      const message = error.code === 'auth/wrong-password' 
        ? 'Email ou mot de passe incorrect'
        : "Erreur lors de la connexion";
      return { success: false, message };
    }
  },

  // Déconnexion
  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
      localStorage.removeItem('patient');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  }
};