import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { findSpecialist } from "../../../Services/SendDiagnostic/SendDiagnostic";
import Patient from "../../../Types/Patient";

import { AlertCircle, Stethoscope, FileText, HelpCircle } from "lucide-react";

interface DiagnosticFormData {
  symptoms: string;
  specialiste: string;
}

const Diagnostic: React.FC = () => {
  const location = useLocation();
  const patient = location.state?.user as Patient;
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DiagnosticFormData>();

  const formatDiagnosticResponse = (response: string) => {
    const sections = {
      "SYNTHÈSE DES SYMPTÔMES": { icon: AlertCircle, color: "text-blue-500" },
      "DIAGNOSTIC PRÉLIMINAIRE": { icon: Stethoscope, color: "text-green-500" },
      RECOMMANDATIONS: { icon: FileText, color: "text-yellow-500" },
      "CONSEILS PRATIQUES": { icon: HelpCircle, color: "text-purple-500" },
    };

    const formattedSections: {
      title: string;
      content: string;
      icon: any;
      color: string;
    }[] = [];

    Object.entries(sections).forEach(([sectionTitle, { icon, color }]) => {
      const sectionMatch = response.match(
        new RegExp(`\\*\\*${sectionTitle}\\*\\*(.+?)(?=\\*\\*|$)`, "s")
      );

      if (sectionMatch) {
        formattedSections.push({
          title: sectionTitle,
          content: sectionMatch[1].trim(),
          icon,
          color,
        });
      }
    });

    return formattedSections;
  };

  // Update the aiResponse state to handle formatted sections
  const [formattedResponse, setFormattedResponse] = useState<any[]>([]);

  // Update onSubmit to use the new formatting
  const onSubmit = async (data: DiagnosticFormData) => {
    if (!patient) {
      toast.error("Informations du patient non disponibles");
      return;
    }
    try {
      const selectedDoctor = await findSpecialist({
        ...data,
        patient,
      });

      if (selectedDoctor) {
        const sections = formatDiagnosticResponse(data.symptoms);
        setFormattedResponse(sections);

        toast.success(
          `Votre diagnostic a été envoyé au Dr. ${selectedDoctor.noms}`
        );
        reset();
      } else {
        toast.error("Aucun spécialiste disponible pour cette spécialité");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du diagnostic:", error);
      toast.error("Erreur lors de l'envoi du diagnostic");
    }
  };

  const specialistes = [
    "Choisir un spécialiste",
    "Médecin généraliste",
    "Cardiologue",
    "Dermatologue",
    "Neurologue",
    "Pédiatre",
    "Psychiatre",
    "Gynécologue",
    "Ophtalmologue",
    "ORL",
    "Rhumatologue",
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#1e242f] rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Diagnostic IA</h2>

        {aiResponse && (
          <div className="mb-6 p-4 bg-[#2a303c] rounded-lg">
            <h3 className="text-white font-semibold mb-2">
              Résultat de l'analyse :
            </h3>
            <div className="text-gray-300 whitespace-pre-wrap">
              {aiResponse.split("\n").map((line, index) => (
                <p key={index} className="mb-2">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-gray-400 mb-2">
              Décrivez vos symptômes
            </label>
            <textarea
              {...register("symptoms", {
                required: "Veuillez décrire vos symptômes",
                minLength: {
                  value: 10,
                  message:
                    "La description doit contenir au moins 10 caractères",
                },
              })}
              className="w-full h-32 bg-[#2a303c] text-white rounded-lg p-4 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez en détail les symptômes que vous ressentez..."
            />
            {errors.symptoms && (
              <p className="mt-1 text-sm text-red-500">
                {errors.symptoms.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-400 mb-2">
              Spécialiste souhaité
            </label>
            <select
              {...register("specialiste", {
                required: "Veuillez choisir un spécialiste",
                validate: (value) =>
                  value !== "Choisir un spécialiste" ||
                  "Veuillez sélectionner un spécialiste valide",
              })}
              className="w-full bg-[#2a303c] text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {specialistes.map((specialiste, index) => (
                <option key={index} value={specialiste} disabled={index === 0}>
                  {specialiste}
                </option>
              ))}
            </select>
            {errors.specialiste && (
              <p className="mt-1 text-sm text-red-500">
                {errors.specialiste.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !patient}
            className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
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
                Analyse en cours...
              </div>
            ) : (
              "Lancer le diagnostic"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Diagnostic;
