import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { auth } from "../../Config/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import axios from "axios";
import ForgotPassword from "./ForgotPassword";
import { AuthService } from "../../Services/Auth/AuthService";

interface UserCredentials {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserCredentials>();

  // Single implementation of handleGoogleLogin
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const response = await AuthService.loginWithGoogle();

      if (response.success && response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("userType", response.data.role);

        // Add this line to store doctorId if the user is a doctor
        if (response.data.role === "doctor") {
          localStorage.setItem("doctorId", response.data.user.id);
        }

        toast.success(`Bienvenue ${response.data.user.noms} !`);
        navigate(`/${response.data.role}`, {
          state: { user: response.data.user },
        });
      } else {
        toast.error(
          response.message || "Erreur lors de la connexion avec Google"
        );
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Connexion annulée");
      } else if (error.code === "auth/invalid-credential") {
        toast.error("Identifiants invalides");
      } else {
        toast.error("Une erreur est survenue lors de la connexion avec Google");
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: UserCredentials) => {
    setLoading(true);
    try {
      // Check admin first
      const adminResponse = await axios.get("http://localhost:3000/admin");
      const admin = adminResponse.data.find(
        (a: any) => a.email === data.email && a.password === data.password
      );

      if (admin) {
        localStorage.setItem("user", JSON.stringify(admin));
        localStorage.setItem("userType", "admin");
        toast.success(`Bienvenue ${admin.noms} !`);
        navigate("/admin", { state: { user: admin } });
        setLoading(false);
        return;
      }

      // Check doctors
      const doctorResponse = await axios.get("http://localhost:3000/doctors");
      const doctor = doctorResponse.data.find(
        (d: any) => d.email === data.email && d.password === data.password
      );

      if (doctor) {
        localStorage.setItem("user", JSON.stringify(doctor));
        localStorage.setItem("userType", "doctor");
        localStorage.setItem("doctorId", doctor.id);
        toast.success(`Bienvenue Dr. ${doctor.noms} !`);
        navigate("/doctor", { state: { user: doctor } });
        setLoading(false);
        return;
      }

      // Check patients
      const patientResponse = await axios.get("http://localhost:3000/patients");
      const patient = patientResponse.data.find(
        (p: any) => p.email === data.email && p.password === data.password
      );

      if (patient) {
        localStorage.setItem("user", JSON.stringify(patient));
        localStorage.setItem("userType", "patient");
        toast.success(`Bienvenue ${patient.noms} !`);
        navigate("/patient", { state: { user: patient } });
        setLoading(false);
        return;
      }

      // If no user found
      toast.error("Email ou mot de passe incorrect");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Une erreur est survenue lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1f2b] flex items-center justify-center p-4">
      <Toaster />
      <div className="bg-[#1e242f] p-8 rounded-lg w-full max-w-md">
        {/* Logo et Titre */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <svg
              className="w-12 h-12 text-blue-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Connexion à MediConsult
          </h1>
          <p className="text-gray-400">Accédez à votre espace personnel</p>
        </div>
        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              {...register("email", {
                required: "Email requis",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Format d'email invalide",
                },
              })}
              type="email"
              placeholder="Adresse e-mail"
              className="w-full bg-[#2a303c] text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              {...register("password", {
                required: "Mot de passe requis",
                minLength: {
                  value: 5,
                  message:
                    "Le mot de passe doit contenir au moins 5 caractères",
                },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              className="w-full bg-[#2a303c] text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm"></label>
            <Link
              to="/forgot-password"
              className="text-blue-500 text-sm hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white rounded-lg py-3 font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Connexion en cours...
              </div>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>
        {/* Séparateur */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#1e242f] text-gray-400">ou</span>
          </div>
        </div>
        {/* Connexion Google */}

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-[#2a303c] text-white rounded-lg py-3 hover:bg-[#2f3643] transition-colors"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          <span>Continuer avec Google</span>
        </button>
        {/* Lien d'inscription */}
        <p className="mt-6 text-center text-gray-400">
          Pas encore de compte ?{" "}
          <Link to="/Signup" className="text-blue-500 hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
