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
  onValidate: (patientId: number) => Promise<void>;
  onReject: (patientId: number) => void;
  onUpdateSymptoms: (patientId: number, newSymptoms: string) => void;
  onAppointmentCancel?: (patientId: number) => void;
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
      await onValidate(diagnostic.patientId);
      const updatedDiagnostic = {
        ...diagnostic,
        status: "traité",
      };
      setSelectedDiagnostic(updatedDiagnostic);
      setShowOrdonnance(true);
    } catch (error) {
      console.error("Error updating diagnostic status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handleUpdateSymptoms = (patientId: number, newSymptoms: string) => {
    const updatedDiagnostics = diagnostics.map((d) =>
      d.patientId === patientId ? { ...d, symptoms: newSymptoms } : d
    );
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
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Diagnostics</h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter("tous")}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              statusFilter === "tous"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
              className="bg-white p-6 rounded-lg hover:bg-gray-50 transition-colors shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-800 font-medium flex items-center gap-2">
                      {diagnostic.patientName}
                    </h3>
                    <div className="flex items-center gap-3 text-gray-500 text-sm mt-1">
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
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
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

              <div className="space-y-2 mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="space-y-4">
                  <div className="border-b border-gray-300 pb-4">
                    <h4 className="text-blue-600 font-medium mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Symptômes Principaux
                    </h4>
                    <p className="text-gray-700">
                      {diagnostic.symptoms
                        .split("**SYNTHÈSE DES SYMPTÖMES**")[1]
                        ?.split("**")[0] || diagnostic.symptoms}
                    </p>
                  </div>

                  {diagnostic.symptoms.includes(
                    "**DIAGNOSTIC PRÉLIMINAIRE**"
                  ) && (
                    <div className="border-b border-gray-300 pb-4">
                      <h4 className="text-green-600 font-medium mb-2 flex items-center gap-2">
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
                              <p className="text-gray-700">{item.trim()}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {diagnostic.symptoms.includes("**RECOMMANDATIONS**") && (
                    <div className="border-b border-gray-300 pb-4">
                      <h4 className="text-yellow-600 font-medium mb-2 flex items-center gap-2">
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
                              <p className="text-gray-700">{item.trim()}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {diagnostic.symptoms.includes("**CONSEILS PRATIQUES**") && (
                    <div>
                      <h4 className="text-blue-600 font-medium mb-2 flex items-center gap-2">
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
                              <p className="text-gray-700">{item.trim()}</p>
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
              doctorName={doctorName}
            />
          </div>
        )}
      </div>

      {isEditModalOpen && editingDiagnostic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl mx-4 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Modifier les symptômes
            </h3>
            <textarea
              value={editedSymptoms}
              onChange={(e) => setEditedSymptoms(e.target.value)}
              className="w-full h-48 bg-gray-50 text-gray-800 rounded-lg p-4 mb-4 resize-none border border-gray-300"
              placeholder="Entrez les nouveaux symptômes..."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingDiagnostic(null);
                  setEditedSymptoms("");
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
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
