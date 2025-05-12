import { useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import {
  Stethoscope,
  ClipboardList,
  Calendar,
  FileText,
  Sun,
  LogOut,
  Bell,
  Moon,
  History as LucideHistory,
  User,
} from "lucide-react";
import Dashboard from "../PatientComponent/Dashboard";
import Appointments from "../PatientComponent/Appointments";
import History from "../PatientComponent/History";
import Profile from "../PatientComponent/Profile";
import { Patient } from "../../../Types/Patient";
import Ordonnance from "../PatientComponent/Ordonnance";
import ChatBot from "../PatientComponent/ChatBot";
import { useAuth } from "../../../Context/AuthContext"; // Add this import

const ViewPatient = () => {
  const { theme, toggleTheme } = useAuth(); // Add this line
  const location = useLocation();
  const user = location.state?.user as Patient;
  const [activeTab, setActiveTab] = useState("dashboard"); // Retour à dashboard comme valeur par défaut
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "diagnostic":
        return <ChatBot />;
      case "appointments":
        return <Appointments />;
      case "history":
        return <History />;
      case "ordonnance":
        return <Ordonnance user={user} />; // Pass user prop here
      case "profile":
        return <Profile user={user} />;
      default:
        return <Dashboard />;
    }
  };

  const handleLogout = () => {
    // Clear any stored user data if needed
    localStorage.removeItem("user");
    // Navigate to login page
    navigate("/login");
  };

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
          <h1 className="text-white text-xl font-semibold">Espace Patient</h1>
        </div>

        {/* Profil utilisateur */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-[#2a303c] rounded-xl">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl">
            {user.noms[0]}
          </div>
          <div>
            <h2 className="text-white font-medium">{user.noms}</h2>
            <p className="text-gray-400 text-sm">Patient</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("diagnostic")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
              activeTab === "diagnostic"
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
            onClick={() => setActiveTab("ordonnance")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
              activeTab === "ordonnance"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-[#2a303c] hover:text-white"
            }`}
          >
            <FileText className="w-5 h-5" />
            Ordonnances
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
      <div className={`flex-1 h-screen overflow-hidden`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-8 pb-0">
            <div className="flex justify-end items-center mb-8">
              <div className="flex items-center gap-4">
                <button>
                  <Bell className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    {user.noms[0]}
                  </div>
                  <span>{user.noms}</span>
                </div>
              </div>
            </div>

            {/* Dashboard fixe */}
            <Dashboard />
          </div>

          {/* Contenu défilable */}
          <div className="flex-1 overflow-y-auto p-8 pt-6">
            <div className={` rounded-lg p-6`}>{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPatient;
