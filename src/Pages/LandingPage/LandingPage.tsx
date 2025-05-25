import React, { useState, useEffect } from "react";
import { Calendar, Users, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      text: "Merci beaucoup pour votre aide. C'est exactement ce dont j'avais besoin. Le diagnostic préliminaire était précis et m'a vraiment aidé à mieux comprendre mes symptômes avant de consulter.",
      name: "Jeanne Kabongo",
      role: "Patiente à Kinshasa",
    },
    {
      text: "Une application révolutionnaire qui aide vraiment nos patients à mieux se préparer avant les consultations.",
      name: "Dr. Patrick Mutombo",
      role: "Médecin à Lubumbashi",
    },
    {
      text: "L'intelligence artificielle au service de la santé en RDC, c'est une avancée majeure pour notre système de santé.",
      name: "Marie Lukusa",
      role: "Infirmière à Kinshasa",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [testimonials.length]);

  useEffect(() => {
    const handleNavClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach((link) => {
      link.addEventListener("click", handleNavClick);
    });

    return () => {
      navLinks.forEach((link) => {
        link.removeEventListener("click", handleNavClick);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md py-8 fixed w-full z-50 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <a href="#" className="text-gray-900 text-2xl font-bold">
            ConsultMe
          </a>
          <div className="flex gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900">
              Services
            </a>
            <a href="#about" className="text-gray-600 hover:text-gray-900">
              À propos
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-gray-900"
            >
              Témoignages
            </a>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700 transition-colors"
            >
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header
        id="hero"
        className="relative min-h-[80vh] flex items-center justify-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/90" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 mt-24 leading-tight">
              L'innovation
              <br />
              au service de votre
              <br />
              <span className="text-blue-600">santé</span>
            </h1>
            <p className="text-gray-700 text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
              Votre assistant médical intelligent pour un diagnostic
              préliminaire précis et personnalisé en RDC
            </p>
            <Link
              to="/login"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition-colors text-lg"
            >
              Commencer un diagnostic
              <svg
                className="w-6 h-6 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Tout-en-Un
          <span className="block w-24 h-2 bg-blue-600 mx-auto mt-2"></span>
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          MediGuide combine tous les outils nécessaires pour un diagnostic
          médical intelligent et un suivi personnalisé
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Diagnostic IA
            </h3>
            <p className="text-gray-600">
              Analyse intelligente de vos symptômes pour un diagnostic
              préliminaire rapide et précis
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Suivi Patient
            </h3>
            <p className="text-gray-600">
              Historique complet de vos consultations et recommandations
              médicales personnalisées
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Réseau Médical
            </h3>
            <p className="text-gray-600">
              Mise en relation directe avec des médecins spécialistes qualifiés
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          À Propos de MediGuide
          <span className="block w-24 h-2 bg-blue-600 mx-auto mt-2"></span>
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Notre Mission
            </h3>
            <p className="text-gray-600 mb-6">
              MediGuide est né d'une vision simple : rendre les soins de santé
              plus accessibles et plus efficaces en RDC grâce à l'intelligence
              artificielle.
            </p>
            <p className="text-gray-600 mb-6">
              Notre système de diagnostic préliminaire aide les patients à mieux
              comprendre leurs symptômes et facilite la communication avec les
              professionnels de santé.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Diagnostic préliminaire rapide et précis
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Suivi médical personnalisé
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Connexion avec des professionnels de santé qualifiés
              </li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4">
                <h4 className="text-3xl font-bold text-blue-600 mb-2">1000+</h4>
                <p className="text-gray-600">Patients Aidés</p>
              </div>
              <div className="text-center p-4">
                <h4 className="text-3xl font-bold text-blue-600 mb-2">50+</h4>
                <p className="text-gray-600">Médecins Partenaires</p>
              </div>
              <div className="text-center p-4">
                <h4 className="text-3xl font-bold text-blue-600 mb-2">24/7</h4>
                <p className="text-gray-600">Disponibilité</p>
              </div>
              <div className="text-center p-4">
                <h4 className="text-3xl font-bold text-blue-600 mb-2">95%</h4>
                <p className="text-gray-600">Taux de Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Nos Médecins Experts
          <span className="block w-24 h-2 bg-blue-600 mx-auto mt-2"></span>
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          MediGuide combine tous les outils nécessaires pour un diagnostic
          médical intelligent et un suivi personnalisé
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full mb-4"></div>
              <blockquote className="text-gray-600 text-center mb-6">
                "MediGuide offre une approche innovante pour le diagnostic
                préliminaire, permettant un meilleur soin."
              </blockquote>
              <div className="text-center">
                <h4 className="text-gray-900 font-semibold">
                  Dr. Mukendi Jean
                </h4>
                <p className="text-blue-600">Médecin Généraliste</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full mb-4"></div>
              <blockquote className="text-gray-600 text-center mb-6">
                "Une solution adaptée aux besoins de notre système de santé en
                RDC, facilitant le triage des patients."
              </blockquote>
              <div className="text-center">
                <h4 className="text-gray-900 font-semibold">
                  Dr. Kalala Marie
                </h4>
                <p className="text-blue-600">Pédiatre</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full mb-4"></div>
              <blockquote className="text-gray-600 text-center mb-6">
                "L'intelligence artificielle au service de la santé, une
                révolution pour l'accès aux soins en RDC."
              </blockquote>
              <div className="text-center">
                <h4 className="text-gray-900 font-semibold">
                  Dr. Kabongo Paul
                </h4>
                <p className="text-blue-600">Cardiologue</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
          <div className="w-2 h-2 rounded-full bg-blue-300"></div>
          <div className="w-2 h-2 rounded-full bg-blue-300"></div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12">
          <div className="md:w-1/3">
            <span className="text-blue-600 uppercase font-medium mb-2 block">
              TÉMOIGNAGES
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ce qu'ils en disent ?
            </h2>
            <p className="text-gray-600 mb-6">
              MediGuide a reçu plus de 1000 évaluations positives de nos
              utilisateurs à travers la RDC.
            </p>
            <p className="text-gray-600 mb-8">
              De nombreux patients et médecins ont grandement bénéficié de
              MediGuide.
            </p>
          </div>

          <div className="md:w-2/3 relative">
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 max-w-2xl ml-auto">
              <p className="text-gray-600 text-lg mb-6">
                {testimonials[currentTestimonial].text}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-gray-900 font-semibold">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-blue-600">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentTestimonial ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Prêt à commencer?
        </h2>
        <p className="text-gray-600 mb-8">
          Rejoignez notre plateforme et bénéficiez d'un diagnostic intelligent
        </p>
        <Link
          to="/register"
          className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors"
        >
          S'inscrire maintenant
        </Link>
      </section>

      {/* Separator */}
      <div className="container mx-auto px-4">
        <div className="h-px bg-gray-200"></div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 ConsultMe. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
