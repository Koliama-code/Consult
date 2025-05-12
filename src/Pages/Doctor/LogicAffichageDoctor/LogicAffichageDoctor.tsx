import React from 'react';
import Doctor from '../../../Types/Doctor';

interface LogicAffichageDoctorProps {
    user: Doctor;
}

const LogicAffichageDoctor: React.FC<LogicAffichageDoctorProps> = ({ user }) => {
    return (
        <div className="bg-[#2a303c] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
                Dr. {user.noms}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <p className="text-gray-400">Spécialité</p>
                    <p className="text-white">{user.specialite}</p>
                </div>
                <div>
                    <p className="text-gray-400">Email</p>
                    <p className="text-white">{user.email}</p>
                </div>
                <div>
                    <p className="text-gray-400">Téléphone</p>
                    <p className="text-white">{user.phone}</p>
                </div>
                <div>
                    <p className="text-gray-400">Adresse</p>
                    <p className="text-white">{user.adresse}</p>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-gray-400">Description</p>
                <p className="text-white">{user.description}</p>
            </div>
        </div>
    );
};

export default LogicAffichageDoctor;
