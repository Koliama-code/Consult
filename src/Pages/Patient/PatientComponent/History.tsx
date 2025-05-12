import {
  Calendar,
  User,
  Stethoscope,
  FileText,
  PlusCircle,
  Trash2, // Add this import
} from "lucide-react";
import { useEffect, useState } from "react";
import Patient from "../../../Types/Patient";
import { toast } from "react-hot-toast"; // Add toast import

function History() {
  const [user, setUser] = useState<Patient | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleDeleteHistory = async (ordonnanceId: number) => {
    try {
      if (!user) return;

      // Filter out the deleted ordonnance
      const updatedOrdonnances = user.Ordonnance.filter(
        (ord) => ord.id !== ordonnanceId
      );

      // Update user data
      const updatedUser = {
        ...user,
        Ordonnance: updatedOrdonnances,
      };

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success("Historique supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (!user || !user.Ordonnance || user.Ordonnance.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-[#1e242f] rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Historique Médical
          </h2>
          <div className="text-gray-400">Aucun historique disponible</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#1e242f] rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          Historique Médical
        </h2>
        <div className="space-y-4">
          {user.Ordonnance.map((ordonnance, index) => (
            <div
              key={index}
              className="bg-[#2a303c] p-6 rounded-xl text-white border border-gray-700 hover:border-blue-500 transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      Consultation {ordonnance.specialite || "Générale"}
                    </p>
                    <div className="flex items-center gap-2 text-gray-400 mt-1">
                      <User className="w-4 h-4" />
                      <span className="text-sm">
                        Dr. {ordonnance.DoctorName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-400 mt-3">
                      <PlusCircle className="w-4 h-4" />
                      <p className="text-sm">
                        Diagnostic: {ordonnance.symptoms}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <p className="text-sm">{ordonnance.date}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteHistory(ordonnance.id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Supprimer l'historique"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex items-start gap-2 text-gray-300">
                  <FileText className="w-5 h-5 mt-0.5 text-orange-400" />
                  <div>
                    <p className="text-sm font-medium text-orange-400 mb-1">
                      Prescription
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>
                        • {ordonnance.nomMedicament} - {ordonnance.posologie}
                      </li>
                      <li>• Durée: {ordonnance.duree}</li>
                      <li>• Dosage: {ordonnance.dosage}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default History;
