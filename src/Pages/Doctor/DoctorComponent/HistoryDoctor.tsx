import React, { useState } from "react";
import { PatientDiagnostic } from "../../../Types/Doctor";
import {
  Trash2,
  History,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

interface HistoryDoctorProps {
  diagnostics: PatientDiagnostic[];
}

const HistoryDoctor: React.FC<HistoryDoctorProps> = ({ diagnostics }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Update the filteredDiagnostics filter function
  const filteredDiagnostics = diagnostics.filter(
    (diagnostic) =>
      (diagnostic.patientName?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (diagnostic.symptoms?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      )
  );

  const handleDelete = async (patientId: number) => {
    try {
      // First confirm with the user
      if (
        !window.confirm("Êtes-vous sûr de vouloir supprimer ce diagnostic ?")
      ) {
        return;
      }

      // Get the diagnostic ID from the diagnostics array
      const diagnosticToDelete = diagnostics.find(
        (d) => d.patientId === patientId
      );

      if (!diagnosticToDelete) {
        toast.error("Diagnostic non trouvé");
        return;
      }

      // Delete the diagnostic using string ID
      await axios.delete(
        `http://localhost:3000/diagnostics/${diagnosticToDelete.id}`
      );

      // Update the UI without page reload
      window.location.href = window.location.href;

      toast.success("Diagnostic supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du diagnostic");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <History className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-white">
            Historique des Diagnostics
          </h2>
        </div>

        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un diagnostic..."
            className="bg-[#2a303c] text-white pl-10 pr-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredDiagnostics.map((diagnostic) => (
          <div
            key={diagnostic.patientId}
            className="bg-[#2a303c] p-6 rounded-lg hover:bg-[#2d3544] transition-colors"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">
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

              <div className="flex items-center gap-3">
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
                <button
                  onClick={() => handleDelete(diagnostic.patientId)}
                  className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors group"
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            <div className="bg-[#1e242f] p-4 rounded-lg">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <span className="text-gray-400 block mb-1">Symptômes :</span>
                  <p className="text-gray-300">
                    {diagnostic.symptoms || "Aucun symptôme enregistré"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredDiagnostics.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Aucun diagnostic trouvé
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryDoctor;
