import React, { useState, useEffect } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import {
  Stethoscope,
  ClipboardList,
  Calendar,
  LogOut,
  Bell,
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

const ViewDoctor: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "diagnostics" | "appointments" | "history" | "profile"
  >("diagnostics");
  const [hasNewDiagnostics, setHasNewDiagnostics] = useState(false);

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

  const handleValidateDiagnostic = async (diagnosticId: string) => {
    if (!doctor) return;

    try {
      await axios.patch(`http://localhost:3000/diagnostics/${diagnosticId}`, {
        status: "traité",
      });

      const updatedDiagnostics = doctor.diagnosticPatient?.map((diag) =>
        diag.id === diagnosticId ? { ...diag, status: "traité" } : diag
      );

      setDoctor({ ...doctor, diagnosticPatient: updatedDiagnostics || [] });
      toast.success("Diagnostic validé avec succès !");
    } catch (error) {
      console.error("Erreur de validation du diagnostic:", error);
      toast.error("Échec de validation du diagnostic.");
    }
  };

  const handleRejectDiagnostic = async (diagnosticId: string) => {
    if (!doctor) return;

    try {
      await axios.patch(`http://localhost:3000/diagnostics/${diagnosticId}`, {
        status: "rejeté",
      });

      const updatedDiagnostics = doctor.diagnosticPatient?.map((diag) =>
        diag.id === diagnosticId ? { ...diag, status: "rejeté" } : diag
      );

      setDoctor({ ...doctor, diagnosticPatient: updatedDiagnostics || [] });
      toast.success("Diagnostic rejeté.");
    } catch (error) {
      console.error("Erreur de rejet du diagnostic:", error);
      toast.error("Échec du rejet du diagnostic.");
    }
  };

  if (!location.state?.user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-800 text-xl">Chargement...</div>
      </div>
    );
  }

  if (!doctor) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      <div className="w-64 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-8">
          <Stethoscope className="text-blue-500 w-6 h-6" />
          <h1 className="text-blue-800 text-xl font-semibold">
            Espace Médecin
          </h1>
        </div>

        <div className="flex items-center gap-4 mb-8 p-4 bg-blue-50 rounded-xl">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl">
            {doctor.noms[0]}
          </div>
          <div>
            <h2 className="text-blue-900 font-medium">{doctor.noms}</h2>
            <p className="text-blue-600 text-sm">Médecin</p>
          </div>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("diagnostics")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
              activeTab === "diagnostics"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-blue-100 hover:text-blue-700"
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
                : "text-gray-600 hover:bg-blue-100 hover:text-blue-700"
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
                : "text-gray-600 hover:bg-blue-100 hover:text-blue-700"
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
                : "text-gray-600 hover:bg-blue-100 hover:text-blue-700"
            }`}
          >
            <User className="w-5 h-5" />
            Profile
          </button>

          <div className="fixed bottom-6 w-52">
            <div className="h-px w-full bg-gray-300 mb-4"></div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </nav>
      </div>

      <div className="flex-1 h-screen overflow-hidden bg-gray-50">
        <div className="h-full flex flex-col">
          <div className="p-8 pb-0">
            <div className="flex justify-end items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    className={`${
                      hasNewDiagnostics ? "text-red-500" : "text-gray-400"
                    } hover:text-gray-600 transition-colors`}
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
                  <span className="text-gray-800 font-medium">
                    {doctor.noms}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 mb-6"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Diagnostics</p>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {doctor.diagnosticPatient?.length || 0}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Rendez-vous</p>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {doctor.appointments?.length || 0}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <LucideHistory className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Diagnostics Traités</p>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {doctor.diagnosticPatient?.filter(
                        (d) => d.status === "traité"
                      ).length || 0}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">En Attente</p>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {doctor.diagnosticPatient?.filter(
                        (d) => d.status === "en_attente"
                      ).length || 0}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 pt-6">
            <div className="bg-white rounded-lg p-6 shadow">
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
