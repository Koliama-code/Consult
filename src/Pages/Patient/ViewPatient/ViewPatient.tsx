import { useState, useEffect } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import {
  Stethoscope,
  ClipboardList,
  Calendar,
  FileText,
  LogOut,
  Bell,
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

const ViewPatient = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Récupérer user depuis location.state OU localStorage
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const user = (location.state?.user as Patient) || parsedUser;

  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Sauvegarder user dans localStorage si disponible
    if (location.state?.user) {
      localStorage.setItem("user", JSON.stringify(location.state.user));
    }
  }, [location.state]);

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
        return <Ordonnance user={user} />;
      case "profile":
        return <Profile user={user} />;
      default:
        return <Dashboard />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6">
        {/* En-tête */}
        <div className="flex items-center gap-3 mb-8">
          <Stethoscope className="text-blue-500 w-6 h-6" />
          <h1 className="text-gray-900 text-xl font-semibold">
            Espace Patient
          </h1>
        </div>

        {/* Profil utilisateur */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-gray-100 rounded-xl">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl">
            {user.noms[0]}
          </div>
          <div>
            <h2 className="text-gray-900 font-medium">{user.noms}</h2>
            <p className="text-gray-500 text-sm">Patient</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {[
            {
              key: "dashboard",
              label: "Dashboard",
              icon: <ClipboardList className="w-5 h-5" />,
            },
            {
              key: "diagnostic",
              label: "Diagnostics",
              icon: <ClipboardList className="w-5 h-5" />,
            },
            {
              key: "appointments",
              label: "Rendez-vous",
              icon: <Calendar className="w-5 h-5" />,
            },
            {
              key: "history",
              label: "Historique",
              icon: <LucideHistory className="w-5 h-5" />,
            },
            {
              key: "ordonnance",
              label: "Ordonnances",
              icon: <FileText className="w-5 h-5" />,
            },
            {
              key: "profile",
              label: "Profile",
              icon: <User className="w-5 h-5" />,
            },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                activeTab === item.key
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          {/* Bouton Déconnexion */}
          <div className="fixed bottom-6 w-52">
            <div className="h-px w-full bg-gray-300 mb-4"></div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-200 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </nav>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 h-screen overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-8 pb-0">
            <div className="flex justify-end items-center mb-8">
              <div className="flex items-center gap-4">
                <button>
                  <Bell className="w-5 h-5 text-gray-700" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    {user.noms[0]}
                  </div>
                  <span className="text-gray-800">{user.noms}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard fixe */}
          <Dashboard />

          {/* Contenu affiché */}
          <div className="flex-1 overflow-y-auto p-8 pt-6">
            <div className="rounded-lg p-6 bg-white">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPatient;
