import React from 'react';
import Patient from '../../../Types/Patient';

interface LogicAffichageProps {
    user: Patient;
}

const LogicAffichage: React.FC<LogicAffichageProps> = ({ user }) => {
    return (
        <div className="bg-[#2a303c] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
                Bienvenue, {user.noms}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div>
                    <p className="text-gray-400">Âge</p>
                    <p className="text-white">{user.age} ans</p>
                </div>
            </div>
        </div>
    );
};

export default LogicAffichage;
