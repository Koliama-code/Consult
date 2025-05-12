import React, { useState, useEffect } from "react";
import { PatientDiagnostic } from "../../../Types/Doctor";
import {
  Calendar,
  Clock,
  User,
  FileText,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import DiagnosticDoctor from "./DiagnosticDoctor";

const AppointmentDoctor: React.FC = () => {
  const [appointments, setAppointments] = useState<PatientDiagnostic[]>([]);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [selectedDiagnostic, setSelectedDiagnostic] =
    useState<PatientDiagnostic | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/diagnostics`);
        const allDiagnostics: PatientDiagnostic[] = await response.json();

        const pendingAppointments = allDiagnostics.filter(
          (diagnostic) => diagnostic.status === "en_attente"
        );

        console.log("Pending appointments:", pendingAppointments);
        setAppointments(pendingAppointments);
      } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous:", error);
        toast.error("Erreur lors du chargement des rendez-vous");
      }
    };

    fetchAppointments();
  }, []);

  // Simplifier l'affichage pour ne montrer que le nom et la date
  const handleViewDiagnostic = (diagnostic: PatientDiagnostic) => {
    setSelectedDiagnostic(diagnostic);
    setShowDiagnostic(true);
  };

  const refreshAppointments = async () => {
    try {
      const response = await fetch(`http://localhost:3000/diagnostics`);
      const allDiagnostics: PatientDiagnostic[] = await response.json();
      const pendingAppointments = allDiagnostics.filter(
        (diagnostic) => diagnostic.status === "en_attente"
      );
      setAppointments(pendingAppointments);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleValidateAndPrescribe = async (diagnostic: PatientDiagnostic) => {
    if (!diagnostic || !diagnostic.patientId) {
      toast.error("Information du diagnostic invalide");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/diagnostics/${diagnostic.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "traité" }),
        }
      );

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");
      await refreshAppointments();
      toast.success("Diagnostic validé avec succès");
    } catch (error) {
      console.error("Error updating diagnostic status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  if (showDiagnostic && selectedDiagnostic) {
    return (
      <DiagnosticDoctor
        diagnostics={[selectedDiagnostic]}
        onValidate={async (patientId) => {
          await handleValidateAndPrescribe(selectedDiagnostic);
        }}
        onReject={(patientId) => {
          refreshAppointments();
          setShowDiagnostic(false);
        }}
        onUpdateSymptoms={(patientId, symptoms) => {
          refreshAppointments();
        }}
        onAppointmentCancel={(patientId) => {
          refreshAppointments();
          setShowDiagnostic(false);
        }}
      />
    );
  }

  return (
    <div className="bg-[#1e242f] rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-bold text-white">Rendez-vous</h2>
        </div>
        <button
          // onClick={refreshAppointments}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title="Rafraîchir la liste"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-500" />
            <p>Aucun rendez-vous en attente</p>
          </div>
        ) : (
          appointments.map((appointment, index) => (
            <div
              key={index}
              className="bg-[#2a303c] p-4 rounded-lg hover:bg-[#2d3544] transition-colors border border-gray-700 cursor-pointer"
              onClick={() => handleViewDiagnostic(appointment)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">
                      {appointment.patientName}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      {appointment.date}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleViewDiagnostic(appointment)}
                  className="text-purple-500 hover:text-purple-400"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentDoctor;
