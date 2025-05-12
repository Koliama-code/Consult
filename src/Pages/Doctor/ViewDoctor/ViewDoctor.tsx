import React, { useState, useEffect } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import {
  Stethoscope,
  ClipboardList,
  Calendar,
  Sun,
  LogOut,
  Bell,
  Moon,
  LucideHistory,
  User,
} from "lucide-react";
import Doctor from "../../../Types/Doctor";
import axios from "axios";
import DiagnosticDoctor from "../DoctorComponent/DiagnosticDoctor";
import AppointmentDoctor from "../DoctorComponent/AppointmentDoctor";
import HistoryDoctor from "../DoctorComponent/HistoryDoctor";
import Profile from "../DoctorComponent/Profile";
import toast from "react-hot-toast";
import { useAuth } from "../../../Context/AuthContext"; // Add this import

const ViewDoctor: React.FC = () => {
  const { theme, toggleTheme } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "diagnostics" | "appointments" | "history" | "profile"
  >("diagnostics");
  // Add the new state here
  const [hasNewDiagnostics, setHasNewDiagnostics] = useState(false);

  // Add the new effect here
  useEffect(() => {
    const checkNewDiagnostics = () => {
      if (doctor?.diagnosticPatient) {
        const newDiags = doctor.diagnosticPatient.filter(
          (d) => d.status === "en_attente"
        );
        setHasNewDiagnostics(newDiags.length > 0);
      }
    };

    checkNewDiagnostics();
  }, [doctor?.diagnosticPatient]);

  useEffect(() => {
    const fetchDoctor = async () => {
      const userEmail = location.state?.user?.email;

      if (!userEmail) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/doctors?email=${userEmail}`
        );
        if (response.data && response.data.length > 0) {
          setDoctor(response.data[0]);
        } else {
          toast.error("Docteur non trouvé");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du docteur:", error);
        toast.error("Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [location.state]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!location.state?.user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1e242f] flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (!doctor) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div
      className={`flex h-screen ${
        theme === "dark" ? "bg-[#1a1f2b]" : "bg-gray-100"
      }`}
    >
      {/* Sidebar */}
      <div
        className={`w-64 ${
          theme === "dark"
            ? "bg-[#1a1f2b] border-gray-800"
            : "bg-white border-gray-200"
        } border-r p-6`}
      >
        {/* En-tête avec logo et titre */}
        <div className="flex items-center gap-3 mb-8">
          <Stethoscope className="text-blue-500 w-6 h-6" />
          <h1 className="text-white text-xl font-semibold">Espace Médecin</h1>
        </div>

        {/* Profil utilisateur */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-[#2a303c] rounded-xl">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl">
            {doctor.noms[0]}
          </div>
          <div>
            <h2 className="text-white font-medium">{doctor.noms}</h2>
            <p className="text-gray-400 text-sm">Médecin</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("diagnostics")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
              activeTab === "diagnostics"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-[#2a303c] hover:text-white"
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            Diagnostics
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
              activeTab === "appointments"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-[#2a303c] hover:text-white"
            }`}
          >
            <Calendar className="w-5 h-5" />
            Rendez-vous
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
              activeTab === "history"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-[#2a303c] hover:text-white"
            }`}
          >
            <LucideHistory className="w-5 h-5" />
            Historique
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
              activeTab === "profile"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-[#2a303c] hover:text-white"
            }`}
          >
            <User className="w-5 h-5" />
            Profile
          </button>

          {/* Options en bas */}
          <div className="fixed bottom-6 w-52">
            {/* Separator */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-4"></div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#2a303c] hover:text-white transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 h-screen overflow-hidden ${
          theme === "dark" ? "bg-[#1a1f2b]" : "bg-gray-50"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-8 pb-0">
            <div className="flex justify-end items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    className={`${
                      hasNewDiagnostics ? "text-red-500" : "text-gray-400"
                    } hover:text-white transition-colors`}
                  >
                    <Bell className="w-5 h-5" />
                  </button>
                  {hasNewDiagnostics && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    {doctor.noms[0]}
                  </div>
                  <span className="text-white">{doctor.noms}</span>
                </div>
              </div>
            </div>

            {/* Séparateur */}
            <div className="border-b border-gray-700 mb-6"></div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#1e242f] p-6 rounded-2xl border border-[#2a2f37]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Diagnostics</p>
                    <h3 className="text-2xl font-semibold text-white">
                      {doctor.diagnosticPatient?.length || 0}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-[#1e242f] p-6 rounded-2xl border border-[#2a2f37]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6  h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Rendez-vous</p>
                    <h3 className="text-2xl font-semibold text-white">
                      {doctor.appointments?.length || 7}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-[#1e242f] p-6 rounded-2xl border border-[#2a2f37]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <LucideHistory className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Diagnostics Traités</p>
                    <h3 className="text-2xl font-semibold text-white">
                      {doctor.diagnosticPatient?.filter(
                        (d) => d.status === "traité"
                      ).length || 2}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-[#1e242f] p-6 rounded-2xl border border-[#2a2f37]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">En Attente</p>
                    <h3 className="text-2xl font-semibold text-white">
                      {doctor.diagnosticPatient?.filter(
                        (d) => d.status === "en attente"
                      ).length || 5}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu défilable */}
          <div className="flex-1 overflow-y-auto p-8 pt-6">
            <div className="bg-[#1e242f] rounded-lg p-6">
              {activeTab === "diagnostics" && (
                <DiagnosticDoctor
                  diagnostics={doctor.diagnosticPatient}
                  onValidate={handleValidateDiagnostic}
                  onReject={handleRejectDiagnostic}
                />
              )}
              {activeTab === "appointments" && <AppointmentDoctor />}
              {activeTab === "history" && (
                <HistoryDoctor diagnostics={doctor.diagnosticPatient} />
              )}
              {activeTab === "profile" && <Profile user={doctor} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDoctor;

const handleValidateDiagnostic = async (patientId: number) => {
  try {
    // Make sure doctor is defined before using it
    if (!currentDoctor) {
      toast.error("Doctor information not available");
      return;
    }

    const updatedDiagnostics = diagnostics.map((d) =>
      d.patientId === patientId ? { ...d, status: "traité" } : d
    );

    const response = await fetch(
      `http://localhost:3000/doctors/${currentDoctor.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          diagnosticPatient: updatedDiagnostics,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update diagnostic status");
    }

    setDiagnostics(updatedDiagnostics);
    toast.success("Diagnostic validé avec succès");
  } catch (error) {
    console.error("Erreur lors de la validation:", error);
    toast.error("Erreur lors de la validation du diagnostic");
  }
};

const handleRejectDiagnostic = async (diagnosticId: number) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/doctors/${doctor?.id}`,
      {
        ...doctor,
        diagnosticPatient: doctor?.diagnosticPatient.filter(
          (diagnostic) => diagnostic.patientId !== diagnosticId
        ),
      }
    );

    if (response.data) {
      setDoctor(response.data);
      toast.success("Diagnostic rejeté avec succès");
    }
  } catch (error) {
    console.error("Erreur lors du rejet:", error);
    toast.error("Erreur lors du rejet du diagnostic");
  }
};
