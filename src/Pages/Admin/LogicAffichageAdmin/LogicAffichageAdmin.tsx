import React from 'react';
import Admin from '../../../Types/Admin';

interface LogicAffichageAdminProps {
    user: Admin;
}

const LogicAffichageAdmin: React.FC<LogicAffichageAdminProps> = ({ user }) => {
    return (
        <div className="bg-[#2a303c] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
                {user.noms}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <p className="text-gray-400">Total Médecins</p>
                    <p className="text-white">{user.totalDoctors}</p>
                </div>
                <div>
                    <p className="text-gray-400">Total Patients</p>
                    <p className="text-white">{user.totalPatients}</p>
                </div>
                <div>
                    <p className="text-gray-400">Total Rendez-vous</p>
                    <p className="text-white">{user.totalAppointments}</p>
                </div>
                <div>
                    <p className="text-gray-400">Email</p>
                    <p className="text-white">{user.email}</p>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-gray-400">Description</p>
                <p className="text-white">{user.description}</p>
            </div>
        </div>
    );
};

export default LogicAffichageAdmin;