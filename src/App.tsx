import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ViewDoctor from "./Pages/Doctor/ViewDoctor/ViewDoctor";
import ViewPatient from "./Pages/Patient/ViewPatient/ViewPatient";
import ViewAdmin from "./Pages/Admin/ViewAdmin/ViewAdmin";
import Login from "./Pages/Authentification/Login";
import Signup from "./Pages/Authentification/Signup";
import LandingPage from "./Pages/LandingPage/LandingPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./Context/AuthContext";
import ForgotPassword from "./Pages/Authentification/ForgotPassword";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            {/* Route par défaut -> LandingPage */}
            <Route path="/" element={<LandingPage />} />

            {/* Route de connexion */}
            <Route path="/login" element={<Login />} />

            {/* Route d'inscription */}
            <Route path="/Signup" element={<Signup />} />

            {/* Route mot de passe oublié */}
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Route pour le dashboard patient */}
            <Route path="/patient/*" element={<ViewPatient />} />

            {/* Route pour le dashboard médecin */}
            <Route path="/doctor/*" element={<ViewDoctor />} />

            {/* Route pour le dashboard Admin */}
            <Route path="/admin/*" element={<ViewAdmin />} />

            {/* Redirection vers landing page pour les routes inconnues */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
