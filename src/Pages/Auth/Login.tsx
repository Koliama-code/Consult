import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { patientAuth } from "../../Services/Auth/PatientAuthService";
import { toast } from "react-hot-toast";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await patientAuth.login(email, password);

      if (result.success) {
        localStorage.setItem("patient", JSON.stringify(result.user));
        toast.success("Connexion réussie");
        navigate("/patient/dashboard");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Erreur lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
};
