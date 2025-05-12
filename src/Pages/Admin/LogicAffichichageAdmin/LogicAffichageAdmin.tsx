import React from "react";
import Admin from "../../../Types/Admin";

interface LogicAffichageAdminProps {
  user: Admin;
}

const LogicAffichageAdmin: React.FC<LogicAffichageAdminProps> = ({ user }) => {
  if (!user) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="bg-[#2a303c] rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">{user?.noms || 'Admin'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-gray-400">Total Médecins</p>
          <p className="text-white">{user?.totalDoctors || 0}</p>
        </div>
        <div>
          <p className="text-gray-400">Total Patients</p>
          <p className="text-white">{user?.totalPatients || 0}</p>
        </div>
        <div>
          <p className="text-gray-400">Total Rendez-vous</p>
          <p className="text-white">{user?.totalAppointments || 0}</p>
        </div>
        <div>
          <p className="text-gray-400">Email</p>
          <p className="text-white">{user?.email || 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-400">Téléphone</p>
          <p className="text-white">{user?.phone || 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-400">Adresse</p>
          <p className="text-white">{user?.adresse || 'N/A'}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-gray-400">Description</p>
        <p className="text-white">{user?.description || 'Aucune description disponible'}</p>
      </div>
    </div>
  );
};

export default LogicAffichageAdmin;
