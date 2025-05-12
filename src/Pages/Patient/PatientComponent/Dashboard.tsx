import React from "react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Separator */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-600 "></div>

      {/* Cartes métriques */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {/* Consultations */}
        <div className="bg-[#1e242f] p-8 rounded-2xl border border-[#2a2f37] hover:border-blue-500/30 transition-all duration-300 shadow-lg hover:shadow-blue-500/10">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-400 text-sm font-medium">
                Consultations
              </h3>
              <p className="text-2xl font-bold mt-2">1</p>
            </div>
            <div className="text-blue-500 bg-blue-500/10 p-3 rounded-lg">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Rendez-vous */}
        <div className="bg-[#1e242f] p-8 rounded-2xl border border-[#2a2f37] hover:border-purple-500/30 transition-all duration-300 shadow-lg hover:shadow-purple-500/10">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-400 text-sm font-medium">Rendez-vous</h3>
              <p className="text-2xl font-bold mt-2">1</p>
            </div>
            <div className="text-purple-500 bg-purple-500/10 p-3 rounded-lg">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Ordonnances */}
        <div className="bg-[#1e242f] p-8 rounded-2xl border border-[#2a2f37] hover:border-orange-500/30 transition-all duration-300 shadow-lg hover:shadow-orange-500/10">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-400 text-sm font-medium">Ordonnances</h3>
              <p className="text-2xl font-bold mt-2">1</p>
            </div>
            <div className="text-orange-500 bg-orange-500/10 p-3 rounded-lg">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Informations rapides */}
    </div>
  );
};

export default Dashboard;
