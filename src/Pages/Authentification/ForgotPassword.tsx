import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    try {
      const [adminResponse, doctorResponse, patientResponse] =
        await Promise.all([
          axios.get("http://localhost:3000/admin"),
          axios.get("http://localhost:3000/doctors"),
          axios.get("http://localhost:3000/patients"),
        ]);

      const admin = adminResponse.data.find((a: any) => a.email === data.email);
      const doctor = doctorResponse.data.find(
        (d: any) => d.email === data.email
      );
      const patient = patientResponse.data.find(
        (p: any) => p.email === data.email
      );

      toast.success(
        "Si un compte existe avec cet email, vous recevrez les instructions de réinitialisation."
      );
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Toaster />
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <svg
              className="w-12 h-12 text-blue-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15V12M12 9H12.01M5.073 19.073C3.017 17.017 2 14.465 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10c0 2.465-1.017 5.017-3.073 7.073C16.87 21.13 14.318 22.146 11.854 22.146c-2.464 0-5.016-1.017-7.073-3.073H5.073Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Mot de passe oublié
          </h1>
          <p className="text-gray-600">
            Entrez votre email pour réinitialiser votre mot de passe
          </p>
        </div>

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
              className="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
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
                Envoi en cours...
              </div>
            ) : (
              "Envoyer les instructions"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          <Link to="/login" className="text-blue-500 hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
