import {
  Calendar,
  User,
  Stethoscope,
  FileText,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import Patient from "../../../Types/Patient";
import { toast } from "react-hot-toast";

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

      const updatedOrdonnances = user.Ordonnance.filter(
        (ord) => ord.id !== ordonnanceId
      );

      const updatedUser = {
        ...user,
        Ordonnance: updatedOrdonnances,
      };

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
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Historique Médical
          </h2>
          <div className="text-gray-500">Aucun historique disponible</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Historique Médical
        </h2>
        <div className="space-y-4">
          {user.Ordonnance.map((ordonnance, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-xl border border-gray-300 hover:border-blue-500 transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-gray-800">
                      Consultation {ordonnance.specialite || "Générale"}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <User className="w-4 h-4" />
                      <span className="text-sm">
                        Dr. {ordonnance.DoctorName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 mt-3">
                      <PlusCircle className="w-4 h-4" />
                      <p className="text-sm">
                        Diagnostic: {ordonnance.symptoms}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <p className="text-sm">{ordonnance.date}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteHistory(ordonnance.id)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                    title="Supprimer l'historique"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-start gap-2 text-gray-700">
                  <FileText className="w-5 h-5 mt-0.5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-orange-500 mb-1">
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
