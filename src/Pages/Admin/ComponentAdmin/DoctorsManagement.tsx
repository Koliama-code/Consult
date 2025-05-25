import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit2, Trash2, Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import { signupDoctor } from "../../../Services/CreateDoctor/CreateDoctor";

const DoctorsManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newDoctorData, setNewDoctorData] = useState({
    noms: "",
    sexe: "",
    phone: "",
    email: "",
    password: "",
    adresse: "",
    specialite: "",
    disponibilite: true,
    diagnosticPatient: [],
  });
  const [formData, setFormData] = useState({
    noms: "",
    specialite: "",
    email: "",
    phone: "",
    password: "",
  });
  const [specialties, setSpecialties] = useState<string[]>([]);

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signupDoctor(newDoctorData);

    if (result.success) {
      toast.success("Médecin ajouté avec succès");
      setIsAdding(false);
      fetchDoctors();
      setNewDoctorData({
        noms: "",
        sexe: "",
        phone: "",
        email: "",
        password: "",
        adresse: "",
        specialite: "",
        disponibilite: true,
        diagnosticPatient: [],
      });
    } else {
      toast.error(result.message);
    }
  };

  const handleEdit = (doctor: any) => {
    setEditingDoctor(doctor);
    setFormData({
      noms: doctor.noms,
      specialite: doctor.specialite,
      email: doctor.email,
      phone: doctor.phone,
      password: doctor.password,
    });
    setIsEditing(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const doctorId = editingDoctor._id || editingDoctor.id;
      const updatedDoctor = {
        ...editingDoctor,
        ...formData,
        disponibilite: editingDoctor.disponibilite || true,
      };

      const response = await axios.put(
        `http://localhost:3000/doctors/${doctorId}`,
        updatedDoctor
      );

      if (response.status === 200) {
        toast.success("Médecin modifié avec succès");
        setIsEditing(false);
        fetchDoctors();
      }
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      toast.error("Erreur lors de la modification du médecin");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce médecin ?")) {
      try {
        await axios.delete(`http://localhost:3000/doctors/${id}`);
        toast.success("Médecin supprimé avec succès");
        fetchDoctors();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        toast.error("Erreur lors de la suppression du médecin");
      }
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:3000/doctors");
      setDoctors(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des médecins:", error);
      toast.error("Erreur lors du chargement des médecins");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchSpecialties = () => {
    const uniqueSpecialties = Array.from(
      new Set(doctors.map((doctor: any) => doctor.specialite))
    );
    setSpecialties(uniqueSpecialties);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchSpecialties();
  }, [doctors]);

  const filteredDoctors = doctors.filter(
    (doctor: any) =>
      doctor.noms.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialite.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-gray-800">Chargement...</div>;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Gestion des Médecins
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Ajouter un médecin
        </button>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Rechercher par nom ou spécialité..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 text-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-gray-600 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4">Nom</th>
              <th className="py-3 px-4">Spécialité</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Téléphone</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredDoctors.map((doctor: any) => (
              <tr
                key={doctor.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-4">{doctor.noms}</td>
                <td className="py-3 px-4">{doctor.specialite}</td>
                <td className="py-3 px-4">{doctor.email}</td>
                <td className="py-3 px-4">{doctor.phone}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      onClick={() => handleEdit(doctor)}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 transition-colors"
                      onClick={() => handleDelete(doctor.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDoctors.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            Aucun médecin trouvé
          </div>
        )}
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Modifier le médecin
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">Nom complet</label>
                <input
                  type="text"
                  name="noms"
                  value={formData.noms}
                  onChange={handleChange}
                  className="w-full bg-gray-50 text-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Spécialité</label>
                <select
                  name="specialite"
                  value={formData.specialite}
                  onChange={handleChange as any}
                  className="w-full bg-gray-50 text-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                >
                  <option value="">Sélectionner une spécialité</option>
                  {specialties.map((specialty, index) => (
                    <option key={index} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-50 text-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Téléphone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-50 text-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition-colors"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-200 text-gray-800 rounded-lg py-2 hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Ajouter un nouveau médecin
            </h3>
            <form onSubmit={handleAddDoctor} className="space-y-5">
              <div>
                <label className="block text-gray-600 mb-2">Nom complet</label>
                <input
                  type="text"
                  value={newDoctorData.noms}
                  onChange={(e) =>
                    setNewDoctorData({ ...newDoctorData, noms: e.target.value })
                  }
                  className="w-full h-11 bg-gray-50 text-gray-800 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-2">Sexe</label>
                <select
                  value={newDoctorData.sexe}
                  onChange={(e) =>
                    setNewDoctorData({ ...newDoctorData, sexe: e.target.value })
                  }
                  className="w-full h-11 bg-gray-50 text-gray-800 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-2">Spécialité</label>
                <div className="flex gap-2">
                  <select
                    value={newDoctorData.specialite}
                    onChange={(e) =>
                      setNewDoctorData({
                        ...newDoctorData,
                        specialite: e.target.value,
                      })
                    }
                    className="w-1/2 h-11 bg-gray-50 text-gray-800 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                  >
                    <option value="">Sélectionner une spécialité</option>
                    {specialties.map((specialty, index) => (
                      <option key={index} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Ou saisir une nouvelle spécialité"
                    onChange={(e) =>
                      setNewDoctorData({
                        ...newDoctorData,
                        specialite: e.target.value,
                      })
                    }
                    className="w-1/2 h-11 bg-gray-50 text-gray-800 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  value={newDoctorData.email}
                  onChange={(e) =>
                    setNewDoctorData({
                      ...newDoctorData,
                      email: e.target.value,
                    })
                  }
                  className="w-full h-11 bg-gray-50 text-gray-800 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-2">Téléphone</label>
                <input
                  type="text"
                  value={newDoctorData.phone}
                  onChange={(e) =>
                    setNewDoctorData({
                      ...newDoctorData,
                      phone: e.target.value,
                    })
                  }
                  className="w-full h-11 bg-gray-50 text-gray-800 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-2">Mot de passe</label>
                <input
                  type="password"
                  value={newDoctorData.password}
                  onChange={(e) =>
                    setNewDoctorData({
                      ...newDoctorData,
                      password: e.target.value,
                    })
                  }
                  className="w-full h-11 bg-gray-50 text-gray-800 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-2">Adresse</label>
                <input
                  type="text"
                  value={newDoctorData.adresse}
                  onChange={(e) =>
                    setNewDoctorData({
                      ...newDoctorData,
                      adresse: e.target.value,
                    })
                  }
                  className="w-full h-11 bg-gray-50 text-gray-800 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                  required
                />
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  className="flex-1 h-11 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 h-11 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsManagement;
