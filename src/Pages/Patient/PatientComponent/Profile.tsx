import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Edit2,
  UserCircle,
  Save,
  X,
  AlertCircle,
} from "lucide-react";
import Patient from "../../../Types/Patient";

interface ProfileProps {
  user: Patient;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: user.email,
    phone: user.phone,
    adresse: user.adresse,
    age: user.age,
    sexe: user.sexe,
  });

  // Modifier le state error pour gérer plusieurs erreurs
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    adresse: "",
    age: "",
    sexe: "",
  });

  // Modifier la fonction validateForm
  const validateForm = () => {
    const newErrors = {
      email: "",
      phone: "",
      adresse: "",
      age: "",
      sexe: "",
    };
    let isValid = true;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
      isValid = false;
    }
    if (!/^\d{9,10}$/.test(formData.phone)) {
      newErrors.phone = "Le numéro doit contenir 9 ou 10 chiffres";
      isValid = false;
    }
    if (Number(formData.age) < 0 || Number(formData.age) > 120) {
      newErrors.age = "L'âge doit être compris entre 0 et 120 ans";
      isValid = false;
    }
    if (!["M", "F"].includes(formData.sexe)) {
      newErrors.sexe = "Le sexe doit être 'M' ou 'F'";
      isValid = false;
    }
    if (!formData.adresse.trim()) {
      newErrors.adresse = "L'adresse ne peut pas être vide";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Modifier handleChange pour réinitialiser l'erreur du champ modifié
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Modifier le renderField pour inclure le message d'erreur
  // Modifier le renderField pour gérer différents types de champs
  const renderField = (
    label: string,
    name: string,
    value: string | number,
    icon: JSX.Element
  ) => {
    return (
      <div className="bg-[#1e242f] p-4 rounded-lg hover:border-blue-500 border border-transparent transition-all duration-300">
        <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
          {icon}
          {label}
        </label>
        {isEditing ? (
          <div>
            {name === "email" ? (
              <input
                type="email"
                name={name}
                value={value}
                onChange={handleChange}
                className={`w-full bg-[#2a303c] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                  errors[name as keyof typeof errors]
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
              />
            ) : name === "age" ? (
              <input
                type="number"
                min="0"
                max="120"
                name={name}
                value={value}
                onChange={handleChange}
                className={`w-full bg-[#2a303c] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                  errors[name as keyof typeof errors]
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
              />
            ) : name === "sexe" ? (
              <select
                name={name}
                value={value}
                onChange={handleChange}
                className={`w-full bg-[#2a303c] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                  errors[name as keyof typeof errors]
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
              >
                <option value="">Sélectionnez</option>
                <option value="M">Homme</option>
                <option value="F">Femme</option>
              </select>
            ) : (
              <input
                type="text"
                name={name}
                value={value}
                onChange={handleChange}
                className={`w-full bg-[#2a303c] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                  errors[name as keyof typeof errors]
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
              />
            )}
            {errors[name as keyof typeof errors] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[name as keyof typeof errors]}
              </p>
            )}
          </div>
        ) : (
          <p className="text-white font-medium">
            {name === "sexe" ? (value === "M" ? "Homme" : "Femme") : value}
          </p>
        )}
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/patients/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...user,
            ...formData,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      // Récupérer les données mises à jour
      const updatedUser = await response.json();

      // Mettre à jour le localStorage
      const storedUser = localStorage.getItem("authUser");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const newUserData = { ...parsedUser, ...formData };
        localStorage.setItem("authUser", JSON.stringify(newUserData));
      }

      // Mettre à jour l'état local
      setIsEditing(false);
      setError("");

      // Afficher un message de succès (optionnel)
      const successMessage = document.createElement("div");
      successMessage.className =
        "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg";
      successMessage.textContent = "Profil mis à jour avec succès";
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil");
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <UserCircle className="w-6 h-6 text-blue-500" />
        Mon Profil
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-[#2a303c] rounded-xl p-8 space-y-8 border border-gray-700"
      >
        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Profile header remains unchanged */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
            {user.noms[0]}
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-white">{user.noms}</h3>
            <p className="text-gray-400 flex items-center gap-2 mt-1">
              <User className="w-4 h-4" />
              Patient
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {renderField(
            "Email",
            "email",
            formData.email,
            <Mail className="w-4 h-4 text-blue-400" />
          )}
          {renderField(
            "Téléphone",
            "phone",
            formData.phone,
            <Phone className="w-4 h-4 text-green-400" />
          )}
          {renderField(
            "Adresse",
            "adresse",
            formData.adresse,
            <MapPin className="w-4 h-4 text-red-400" />
          )}
          {renderField(
            "Âge",
            "age",
            formData.age,
            <Calendar className="w-4 h-4 text-purple-400" />
          )}
          {renderField(
            "Sexe",
            "sexe",
            formData.sexe,
            <User className="w-4 h-4 text-yellow-400" />
          )}
        </div>

        <div className="pt-6 border-t border-gray-700">
          {isEditing ? (
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white rounded-lg py-3 hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setError("");
                  setFormData({
                    email: user.email,
                    phone: user.phone,
                    adresse: user.adresse,
                    age: user.age,
                    sexe: user.sexe,
                  });
                }}
                className="flex-1 bg-red-600 text-white rounded-lg py-3 hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
              >
                <X className="w-4 h-4" />
                Annuler
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Modifier mon profil
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;
