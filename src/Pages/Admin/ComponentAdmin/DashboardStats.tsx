import React, { useState, useEffect } from "react";
import { Users, Calendar, FileText } from "lucide-react";
import Admin from "../../../Types/Admin";
import axios from "axios";

interface DashboardStatsProps {
  admin: Admin;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ admin }) => {
  const [stats, setStats] = useState({
    doctorsCount: 4,
    patientsCount: 4,
    appointmentsCount: 34,
    prescriptionsCount: 47,
  });

  const fetchStats = async () => {
    try {
      const doctorsResponse = await axios.get("http://localhost:3000/doctors");
      const patientsResponse = await axios.get(
        "http://localhost:3000/patients"
      );
      const diagnostic = await axios.get("http://localhost:3000/diagnostics");
      const ordonnance = await axios.get("http://localhost:3000/ordonnances");

      const doctors = doctorsResponse.data;
      const patients = patientsResponse.data;
      const diagnosticData = diagnostic.data;
      const ordonnanceData = ordonnance.data;

      setStats({
        doctorsCount: doctors.length,
        patientsCount: patients.length,
        appointmentsCount: diagnosticData.length,
        prescriptionsCount: ordonnanceData.length,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Carte Médecins */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Médecins</p>
            <h3 className="text-2xl font-semibold text-gray-800">
              {stats.doctorsCount}
            </h3>
          </div>
        </div>
      </div>

      {/* Carte Patients */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Patients</p>
            <h3 className="text-2xl font-semibold text-gray-800">
              {stats.patientsCount}
            </h3>
          </div>
        </div>
      </div>

      {/* Carte Rendez-vous */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Rendez-vous</p>
            <h3 className="text-2xl font-semibold text-gray-800">
              {stats.appointmentsCount}
            </h3>
          </div>
        </div>
      </div>

      {/* Carte Ordonnances */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Ordonnances</p>
            <h3 className="text-2xl font-semibold text-gray-800">
              {stats.prescriptionsCount}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
