import React, { useState, useEffect } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import {
  Shield,
  Users,
  Sun,
  LogOut,
  Bell,
  Moon,
  User,
  FileBarChart,
} from "lucide-react";

import Admin from "../../../Types/Admin";
import axios from "axios";
import PatientsManagement from "../ComponentAdmin/PatientsManagement";
import SystemSettings from "../ComponentAdmin/Rapport";
import Profile from "../ComponentAdmin/Profile";
import DoctorsManagement from "../ComponentAdmin/DoctorsManagement";
import toast from "react-hot-toast";
import DashboardStats from "../ComponentAdmin/DashboardStats";
import Rapport from "../ComponentAdmin/Rapport";
// Add to imports at the top
import Supervision from "../ComponentAdmin/Supervision";
import { useAuth } from "../../../Context/AuthContext"; // Add this import

const ViewAdmin: React.FC = () => {
  const { theme, toggleTheme } = useAuth(); // Add this line
  const location = useLocation();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  // Update the activeTab type
  const [activeTab, setActiveTab] = useState<
    "doctors" | "patients" | "rapports" | "profile" | "supervision"
  >("doctors");

  useEffect(() => {
    const fetchAdmin = async () => {
      const userEmail = location.state?.user?.email;

      if (!userEmail) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/admin?email=${userEmail}`
        );
        if (response.data && response.data.length > 0) {
          setAdmin(response.data[0]);
        } else {
          toast.error("Administrateur non trouvé");
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'administrateur:",
          error
        );
        toast.error("Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [location.state]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Add content rendering function
  const renderContent = () => {
    switch (activeTab) {
      case "doctors":
        return <DoctorsManagement />;
      case "patients":
        return <PatientsManagement />;
      case "rapports":
        return <Rapport />;
      //   case "supervision":
      //     return <Supervision />;
      case "profile":
        return admin ? <Profile user={admin} /> : null;
      default:
        return null;
    }
  };

  // Early returns for loading and auth states
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

  if (!admin) {
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
        <div className="flex items-center gap-3 mb-12 mt-8">
          <Shield className="text-blue-500 w-6 h-6" />
          <h1 className="text-white text-xl font-semibold">Admin </h1>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("doctors")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
              activeTab === "doctors"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-[#2a303c] hover:text-white"
            }`}
          >
            <Users className="w-5 h-5" />
            Gestion Médecins
          </button>
          <button
            onClick={() => setActiveTab("patients")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
              activeTab === "patients"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-[#2a303c] hover:text-white"
            }`}
          >
            <Users className="w-5 h-5" />
            Gestion Patients
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
              activeTab === "settings"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-[#2a303c] hover:text-white"
            }`}
          >
            <FileBarChart className="w-5 h-5" />
            Rapports
          </button>
          {/* 
          <button
            onClick={() => setActiveTab("supervision")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
              activeTab === "supervision"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-[#2a303c] hover:text-white"
            }`}
          >
            <LineChart className="w-5 h-5" />
            Supervision
          </button> */}

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
                <button className="text-gray-400 hover:text-white">
                  <Moon className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-white">
                  <Bell className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    {admin?.noms?.[0] || "A"}
                  </div>
                  <span className="text-white">{admin?.noms || "Admin"}</span>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-700 mb-6"></div>

            {/* Dashboard Stats */}
            <DashboardStats admin={admin} />
          </div>

          {/* Contenu défilable */}
          <div className="flex-1 overflow-y-auto p-8 pt-6">
            <div className="bg-[#1e242f] rounded-lg p-6">
              {activeTab === "doctors" && <DoctorsManagement />}
              {activeTab === "patients" && <PatientsManagement />}
              {activeTab === "settings" && <SystemSettings />}
              {activeTab === "supervision" && <Supervision />}
              {activeTab === "profile" && admin && <Profile user={admin} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAdmin;
