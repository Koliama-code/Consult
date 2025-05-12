import React, { useState, useEffect } from "react";
import { PatientDiagnostic } from "../../../Types/Doctor";
import OrdonnaceDoctor from "./OrdonnaceDoctor";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  FileText,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface DiagnosticDoctorProps {
  diagnostics: PatientDiagnostic[];
  onValidate: (patientId: number) => Promise<void>; // Changed to Promise
  onReject: (patientId: number) => void;
  onUpdateSymptoms: (patientId: number, newSymptoms: string) => void;
  onAppointmentCancel?: (patientId: number) => void; // Add this prop
}

const DiagnosticDoctor: React.FC<DiagnosticDoctorProps> = ({
  diagnostics,
  onValidate,
  onReject,
  onUpdateSymptoms,
  onAppointmentCancel,
}) => {
  const [doctorName, setDoctorName] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "tous" | "en_attente" | "traité"
  >("tous");
  const [showOrdonnance, setShowOrdonnance] = useState(false);
  const [selectedDiagnostic, setSelectedDiagnostic] =
    useState<PatientDiagnostic | null>(null);
  // Add new states here
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDiagnostic, setEditingDiagnostic] =
    useState<PatientDiagnostic | null>(null);
  const [editedSymptoms, setEditedSymptoms] = useState("");

  const filteredDiagnostics =
    statusFilter === "tous"
      ? diagnostics
      : diagnostics.filter((d) => d.status === statusFilter);

  const handleOrdonnanceClick = (diagnostic: PatientDiagnostic) => {
    setSelectedDiagnostic(diagnostic);
    setShowOrdonnance(true);
  };

  const handleValidateAndPrescribe = async (diagnostic: PatientDiagnostic) => {
    if (!diagnostic || !diagnostic.patientId) {
      toast.error("Information du diagnostic invalide");
      return;
    }

    try {
      // First validate/update the status
      await onValidate(diagnostic.patientId);

      // Update the diagnostic status locally
      const updatedDiagnostic = {
        ...diagnostic,
        status: "traité",
      };

      // Show ordonnance with updated diagnostic
      setSelectedDiagnostic(updatedDiagnostic);
      setShowOrdonnance(true);
    } catch (error) {
      console.error("Error updating diagnostic status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handleUpdateSymptoms = (patientId: number, newSymptoms: string) => {
    // Update the diagnostics locally
    const updatedDiagnostics = diagnostics.map((d) =>
      d.patientId === patientId ? { ...d, symptoms: newSymptoms } : d
    );

    // Update in parent component through onReject
    onReject(patientId);
  };

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const doctorId = localStorage.getItem("doctorId");
        const response = await fetch(
          `http://localhost:3000/doctors/${doctorId}`
        );
        const doctor = await response.json();
        setDoctorName(`Dr. ${doctor.noms}`);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchDoctorData();
  }, []);

  return (
    <div className="bg-[#1e242f] rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-white">Diagnostics</h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter("tous")}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              statusFilter === "tous"
                ? "bg-blue-600 text-white"
                : "bg-[#2a303c] text-gray-400 hover:text-white"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Tous
          </button>
          <button
            onClick={() => setStatusFilter("en_attente")}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              statusFilter === "en_attente"
                ? "bg-blue-600 text-white"
                : "bg-[#2a303c] text-gray-400 hover:text-white"
            }`}
          >
            <Clock className="w-4 h-4" />
            En attente
          </button>
          <button
            onClick={() => setStatusFilter("traité")}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              statusFilter === "traité"
                ? "bg-blue-600 text-white"
                : "bg-[#2a303c] text-gray-400 hover:text-white"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Traités
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {!showOrdonnance ? (
          filteredDiagnostics.map((diagnostic, index) => (
            <div
              key={`${diagnostic.patientId}-${index}`}
              className="bg-[#2a303c] p-6 rounded-lg hover:bg-[#2d3544] transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium flex items-center gap-2">
                      {diagnostic.patientName}
                    </h3>
                    <div className="flex items-center gap-3 text-gray-400 text-sm mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {diagnostic.date}
                      </div>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                    diagnostic.status === "en_attente"
                      ? "bg-yellow-500/20 text-yellow-500"
                      : "bg-green-500/20 text-green-500"
                  }`}
                >
                  {diagnostic.status === "en_attente" ? (
                    <>
                      <Clock className="w-4 h-4" />
                      En attente
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Traité
                    </>
                  )}
                </span>
              </div>

              <div className="space-y-2 mb-4 bg-[#1e242f] p-4 rounded-lg">
                <div className="space-y-4">
                  {/* Symptômes principaux */}
                  <div className="border-b border-gray-700 pb-4">
                    <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Symptômes Principaux
                    </h4>
                    <p className="text-gray-300">
                      {diagnostic.symptoms
                        .split("**SYNTHÈSE DES SYMPTÖMES**")[1]
                        ?.split("**")[0] || diagnostic.symptoms}
                    </p>
                  </div>

                  {/* Diagnostic préliminaire */}
                  {diagnostic.symptoms.includes(
                    "**DIAGNOSTIC PRÉLIMINAIRE**"
                  ) && (
                    <div className="border-b border-gray-700 pb-4">
                      <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                        <ClipboardList className="w-5 h-5" />
                        Diagnostic Préliminaire
                      </h4>
                      <div className="space-y-2">
                        {diagnostic.symptoms
                          .split("**DIAGNOSTIC PRÉLIMINAIRE**")[1]
                          ?.split("**RECOMMANDATIONS**")[0]
                          .split("-")
                          .filter((item) => item.trim())
                          .map((item, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                              <p className="text-gray-300">{item.trim()}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Recommandations */}
                  {diagnostic.symptoms.includes("**RECOMMANDATIONS**") && (
                    <div className="border-b border-gray-700 pb-4">
                      <h4 className="text-yellow-400 font-medium mb-2 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Recommandations
                      </h4>
                      <div className="space-y-2">
                        {diagnostic.symptoms
                          .split("**RECOMMANDATIONS**")[1]
                          ?.split("**")[0]
                          .split("-")
                          .filter((item) => item.trim())
                          .map((item, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                              <p className="text-gray-300">{item.trim()}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Conseils pratiques */}
                  {diagnostic.symptoms.includes("**CONSEILS PRATIQUES**") && (
                    <div>
                      <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Conseils Pratiques
                      </h4>
                      <div className="space-y-2">
                        {diagnostic.symptoms
                          .split("**CONSEILS PRATIQUES**")[1]
                          ?.split("**")[0]
                          .split("-")
                          .filter((item) => item.trim())
                          .map((item, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                              <p className="text-gray-300">{item.trim()}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {diagnostic.status === "en_attente" ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleValidateAndPrescribe(diagnostic)}
                    className="flex-1 bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Prescrire
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleOrdonnanceClick(diagnostic)}
                  className="w-full bg-green-600 text-white rounded py-2 hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Faire une ordonnance
                </button>
              )}
            </div>
          ))
        ) : (
          <div key="ordonnance-view">
            {" "}
            <button
              onClick={() => {
                setShowOrdonnance(false);
                setSelectedDiagnostic(null);
              }}
              className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour aux diagnostics
            </button>
            <OrdonnaceDoctor
              diagnostic={selectedDiagnostic || undefined}
              doctorName={doctorName} // Use the state variable here
            />
          </div>
        )}
      </div>

      {/* Add modal at the end of the component */}
      {isEditModalOpen && editingDiagnostic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2a303c] p-6 rounded-lg w-full max-w-2xl mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Modifier les symptômes
            </h3>
            <textarea
              value={editedSymptoms}
              onChange={(e) => setEditedSymptoms(e.target.value)}
              className="w-full h-48 bg-[#1e242f] text-white rounded-lg p-4 mb-4 resize-none"
              placeholder="Entrez les nouveaux symptômes..."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingDiagnostic(null);
                  setEditedSymptoms("");
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              // Update the save button in the modal
              <button
                onClick={() => {
                  if (editingDiagnostic && editedSymptoms.trim()) {
                    handleUpdateSymptoms(
                      editingDiagnostic.patientId,
                      editedSymptoms.trim()
                    );
                    setIsEditModalOpen(false);
                    setEditingDiagnostic(null);
                    setEditedSymptoms("");
                  }
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticDoctor;

// Add this method
const handleAppointmentCancellation = async (patientId: number) => {
  try {
    // Update local state
    const updatedDiagnostics = diagnostics.filter(
      (d) => d.patientId !== patientId
    );

    // Notify parent component
    if (onAppointmentCancel) {
      onAppointmentCancel(patientId);
    }

    toast.success("Rendez-vous annulé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'annulation:", error);
    toast.error("Erreur lors de l'annulation du rendez-vous");
  }
};
