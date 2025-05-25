import React, { useState } from "react";
import {
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  UserCircle,
  Edit2,
  X,
  AlertCircle,
  Shield,
} from "lucide-react";
import Admin from "../../../Types/Admin";
import toast from "react-hot-toast";

interface ProfileProps {
  user: Admin;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    noms: user?.noms || "",
    email: user?.email || "",
    phone: user?.phone || "",
    adresse: user?.adresse || "",
    sexe: user?.sexe || "",
  });

  const [errors, setErrors] = useState({
    noms: "",
    email: "",
    phone: "",
    adresse: "",
    sexe: "",
  });

  const validateForm = () => {
    const newErrors = {
      email: "",
      phone: "",
      adresse: "",
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
    if (!formData.adresse.trim()) {
      newErrors.adresse = "L'adresse ne peut pas être vide";
      isValid = false;
    }
    if (!["M", "F"].includes(formData.sexe)) {
      newErrors.sexe = "Le sexe doit être 'M' ou 'F'";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
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

  const renderField = (
    label: string,
    name: string,
    value: string,
    icon: JSX.Element,
    type: "text" | "email" = "text"
  ) => {
    return (
      <div className="bg-gray-50 p-4 rounded-lg hover:border-blue-500 border border-gray-200 transition-all duration-300">
        <label className="block text-gray-600 text-sm mb-2 flex items-center gap-2">
          {icon}
          {label}
        </label>
        {isEditing ? (
          <div>
            <input
              type={type}
              name={name}
              value={value}
              onChange={handleChange}
              className={`w-full bg-white text-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 border ${
                errors[name as keyof typeof errors]
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors[name as keyof typeof errors] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[name as keyof typeof errors]}
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-800 font-medium">{value}</p>
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
      const response = await fetch(`http://localhost:3000/admin/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          noms: formData.noms,
          email: formData.email,
          phone: formData.phone,
          adresse: formData.adresse,
          sexe: formData.sexe,
          password: user.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const newUserData = { ...parsedUser, ...formData };
        localStorage.setItem("user", JSON.stringify(newUserData));
      }

      setIsEditing(false);
      setError("");
      toast.success("Profil mis à jour avec succès");
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil");
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <UserCircle className="w-6 h-6 text-blue-600" />
        Mon Profil
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-8 space-y-8 shadow-sm border border-gray-200"
      >
        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
            {formData.noms[0]}
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {formData.noms}
            </h3>
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <Shield className="w-4 h-4" />
              Administrateur
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {renderField(
            "Nom complet",
            "noms",
            formData.noms,
            <User className="w-4 h-4 text-purple-600" />
          )}
          <div className="bg-gray-50 p-4 rounded-lg hover:border-blue-500 border border-gray-200 transition-all duration-300">
            <label className="block text-gray-600 text-sm mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-yellow-600" />
              Sexe
            </label>
            {isEditing ? (
              <div>
                <select
                  name="sexe"
                  value={formData.sexe}
                  onChange={handleChange}
                  className={`w-full bg-white text-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 border ${
                    errors.sexe
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                >
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
                {errors.sexe && (
                  <p className="text-red-500 text-sm mt-1">{errors.sexe}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-800 font-medium">
                {formData.sexe === "M"
                  ? "Masculin"
                  : formData.sexe === "F"
                  ? "Féminin"
                  : "Non spécifié"}
              </p>
            )}
          </div>
          {renderField(
            "Email",
            "email",
            formData.email,
            <Mail className="w-4 h-4 text-blue-600" />,
            "email"
          )}
          {renderField(
            "Téléphone",
            "phone",
            formData.phone,
            <Phone className="w-4 h-4 text-green-600" />
          )}
          {renderField(
            "Adresse",
            "adresse",
            formData.adresse,
            <MapPin className="w-4 h-4 text-red-600" />
          )}
        </div>

        <div className="pt-6 border-t border-gray-200">
          {isEditing ? (
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white rounded-lg py-3 hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-sm"
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
                    noms: user.noms,
                    email: user.email,
                    phone: user.phone,
                    adresse: user.adresse,
                    sexe: user.sexe,
                  });
                }}
                className="flex-1 bg-gray-200 text-gray-800 rounded-lg py-3 hover:bg-gray-300 transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-sm"
              >
                <X className="w-4 h-4" />
                Annuler
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-sm"
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
