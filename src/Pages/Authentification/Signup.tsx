import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type Patient from "../../Types/Patient";
import { signupPatient } from "../../Services/SignupPatient/SignupPatient";
import { toast, Toaster } from "react-hot-toast";

type SignupFormData = Omit<Patient, "id" | "Ordonnance">;

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>();

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      const response = await signupPatient(data);
      if (response.success) {
        toast.success("Inscription réussie !");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center p-4">
      <Toaster />
      <div className="w-full max-w-md bg-[#1e2536] rounded-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="text-blue-500 mb-4">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-6h2v2h-2v-2zm0-8h2v6h-2V6z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Créer un compte</h2>
          <p className="text-gray-400 text-sm mt-2">
            Rejoignez MediConsult dès aujourd'hui
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("noms", {
              required: "Le nom est requis",
              minLength: {
                value: 2,
                message: "Le nom doit contenir au moins 2 caractères",
              },
            })}
            type="text"
            placeholder="Nom complet"
            className="w-full bg-[#262d3d] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.noms && (
            <p className="text-red-500 text-sm">{errors.noms.message}</p>
          )}

          <select
            {...register("sexe", { required: "Le sexe est requis" })}
            className="w-full bg-[#262d3d] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionnez le sexe</option>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
          {errors.sexe && (
            <p className="text-red-500 text-sm">{errors.sexe.message}</p>
          )}

          <input
            {...register("phone", {
              required: "Le téléphone est               requis",
              pattern: {
                value: /^[0-9]+$/,
                message: "Numéro de téléphone invalide",
              },
            })}
            type="tel"
            placeholder="Téléphone"
            className="w-full bg-[#262d3d] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}

          <input
            {...register("email", {
              required: "L'email est requis",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email invalide",
              },
            })}
            type="email"
            placeholder="Email"
            className="w-full bg-[#262d3d] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <input
            {...register("password", {
              required: "Le mot de passe est requis",
              minLength: {
                value: 6,
                message: "Le mot de passe doit contenir au moins 6 caractères",
              },
            })}
            type="password"
            placeholder="Mot de passe"
            className="w-full bg-[#262d3d] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          <input
            {...register("adresse", { required: "L'adresse est requise" })}
            type="text"
            placeholder="Adresse"
            className="w-full bg-[#262d3d] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.adresse && (
            <p className="text-red-500 text-sm">{errors.adresse.message}</p>
          )}

          <input
            {...register("age", {
              required: "L'âge est requis",
              min: { value: 0, message: "L'âge doit être positif" },
            })}
            type="number"
            placeholder="Âge"
            className="w-full bg-[#262d3d] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.age && (
            <p className="text-red-500 text-sm">{errors.age.message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Déjà un compte ?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
