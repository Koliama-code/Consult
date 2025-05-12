import { auth } from '../../Config/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import axios from 'axios';

export const AuthService = {
  loginWithEmail: async (email: string, password: string) => {
    try {
      const [patientResponse, doctorResponse] = await Promise.all([
        axios.get(`http://localhost:3000/patients?email=${email}&password=${password}`),
        axios.get(`http://localhost:3000/doctors?email=${email}&password=${password}`)
      ]);

      const userData = patientResponse.data[0] || doctorResponse.data[0];
      
      if (!userData) {
        return {
          success: false,
          message: "Email ou mot de passe incorrect"
        };
      }

      return {
        success: true,
        data: {
          user: userData,
          role: patientResponse.data[0] ? 'patient' : 'doctor'
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: "Une erreur est survenue lors de la connexion"
      };
    }
  },

  loginWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { email } = result.user;

      // Vérifier si l'utilisateur existe déjà dans la base de données
      const [patientResponse, doctorResponse] = await Promise.all([
        axios.get(`http://localhost:3000/patients?email=${email}`),
        axios.get(`http://localhost:3000/doctors?email=${email}`)
      ]);

      const userData = patientResponse.data[0] || doctorResponse.data[0];
      
      if (userData) {
        return {
          success: true,
          data: {
            user: userData,
            role: patientResponse.data[0] ? 'patient' : 'doctor'
          }
        };
      }

      // Si l'utilisateur n'existe pas, créer un nouveau patient
      const newPatient = {
        id: result.user.uid,
        noms: result.user.displayName || email.split('@')[0],
        email: email,
        photoURL: result.user.photoURL,
        Ordonnance: [],
        authProvider: 'google'
      };

      await axios.post('http://localhost:3000/patients', newPatient);

      return {
        success: true,
        data: {
          user: newPatient,
          role: 'patient'
        }
      };
    } catch (error) {
      console.error('Google login error:', error);
      return {
        success: false,
        message: "Erreur lors de la connexion avec Google"
      };
    }
  }
};