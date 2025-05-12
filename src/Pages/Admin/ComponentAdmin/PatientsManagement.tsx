import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit2, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";

const PatientsManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:3000/patients");
      setPatients(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des patients:", error);
      toast.error("Erreur lors du chargement des patients");
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) {
      try {
        await axios.delete(`http://localhost:3000/patients/${id}`);
        toast.success("Patient supprimé avec succès");
        fetchPatients();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        toast.error("Erreur lors de la suppression du patient");
      }
    }
  };

  if (loading) {
    return <div className="text-white">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">
          Gestion des Patients
        </h2>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          Ajouter un patient
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-gray-400 border-b border-gray-700">
            <tr>
              <th className="py-3 px-4">Nom</th>
              <th className="py-3 px-4">Age</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Téléphone</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {patients.map((patient: any) => (
              <tr key={patient.id} className="border-b border-gray-700">
                <td className="py-3 px-4">{patient.noms}</td>
                <td className="py-3 px-4">{patient.age}</td>
                <td className="py-3 px-4">{patient.email}</td>
                <td className="py-3 px-4">{patient.phone}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button className="text-blue-500 hover:text-blue-600">
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(patient.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientsManagement;