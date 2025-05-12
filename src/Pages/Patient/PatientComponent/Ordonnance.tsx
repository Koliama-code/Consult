import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Calendar,
  User,
  Pill,
  Clock,
  Timer,
  FileText,
  Save,
  AlertCircle,
  Thermometer,
} from "lucide-react";
import Patient from "../../../Types/Patient";
import { jsPDF } from "jspdf";

interface OrdonnanceProps {
  user: Patient;
}

const Ordonnance: React.FC<OrdonnanceProps> = ({ user }) => {
  if (!user || !user.Ordonnance || user.Ordonnance.length === 0) {
    return (
      <div className="bg-[#1e242f] p-8 rounded-xl">
        <h2 className="text-2xl font-bold text-white mb-6">Mes Ordonnances</h2>
        <div className="flex items-center gap-3 text-gray-400">
          <AlertCircle className="w-5 h-5" />
          <p>Aucune ordonnance disponible.</p>
        </div>
      </div>
    );
  }

  const handleSaveOrdonnance = (ordonnance: any) => {
    const doc = new jsPDF();

    // Add hospital/clinic header
    doc.setFontSize(22);
    doc.setTextColor(44, 62, 80);
    doc.text("ConsultMe", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(127, 140, 141);
    doc.text("Centre Médical Spécialisé", 105, 28, { align: "center" });
    doc.text("123 Avenue de la Santé, Goma, RDC", 105, 34, {
      align: "center",
    });
    doc.text("Tél: +243 995 456 789", 105, 40, { align: "center" });

    // Add horizontal line
    doc.setDrawColor(52, 152, 219);
    doc.line(20, 45, 190, 45);

    // Doctor information
    doc.setFontSize(11);
    doc.setTextColor(44, 62, 80);
    doc.text(`Dr. ${ordonnance.DoctorName}`, 20, 55);
    doc.setFontSize(10);
    doc.setTextColor(127, 140, 141);
    doc.text("Médecin Généraliste", 20, 61);
    doc.text("N° Ordre: MED/2023/001", 20, 67);

    // Date and patient info
    doc.setFontSize(11);
    doc.setTextColor(44, 62, 80);
    doc.text(`Date: ${ordonnance.date}`, 150, 55);
    doc.text("ORDONNANCE", 105, 80, { align: "center" });

    // Patient information in a box
    doc.setDrawColor(189, 195, 199);
    doc.setFillColor(236, 240, 241);
    doc.rect(20, 90, 170, 25, "F");
    doc.setTextColor(44, 62, 80);
    doc.text("Patient:", 25, 100);
    doc.setFontSize(10);
    doc.text(`Nom: ${ordonnance.PatientName}`, 25, 107);

    // Prescription content
    doc.setFontSize(11);
    doc.setTextColor(44, 62, 80);
    let y = 135;

    // Medication details with Rp symbol
    doc.text("℞", 25, y);
    doc.setFont("helvetica", "bold");
    doc.text(`${ordonnance.nomMedicament} - ${ordonnance.forme}`, 40, y);
    doc.setFont("helvetica", "normal");
    y += 10;
    doc.text(`Dosage: ${ordonnance.dosage}`, 40, y);
    y += 10;
    doc.text(`Posologie: ${ordonnance.posologie}`, 40, y);
    y += 10;
    doc.text(`Durée: ${ordonnance.duree}`, 40, y);
    y += 20;

    // Add symptoms treated
    doc.text("Symptômes traités:", 25, y);
    y += 7;
    doc.setFontSize(10);
    doc.text(ordonnance.symptoms, 40, y);

    // Add electronic authentication section
    y += 15;
    doc.line(20, y, 190, y);

    // Add verification note
    doc.setFontSize(8);
    doc.setTextColor(127, 140, 141);
    doc.text(
      "Ce document est authentifié électroniquement par ConsultMe et ne nécessite pas de signature physique",
      105,
      220,
      { align: "center" }
    );

    // Save the PDF
    doc.save(`ordonnance_${ordonnance.date.replace(/\//g, "-")}.pdf`);
  };

  return (
    <div className="bg-[#1e242f] p-8 rounded-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Mes Ordonnances</h2>

      <div className="space-y-6">
        {user.Ordonnance.map((ordonnance) => (
          <div
            key={ordonnance.id}
            className="bg-[#2a303c] p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    Ordonnance du {ordonnance.date}
                  </h3>
                  <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                    <User className="w-4 h-4" />
                    Dr. {ordonnance.DoctorName}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-[#1e242f] p-4 rounded-lg">
                  <h4 className="text-gray-400 text-sm flex items-center gap-2 mb-2">
                    <Pill className="w-4 h-4 text-purple-400" />
                    Médicament
                  </h4>
                  <p className="text-white font-medium">
                    {ordonnance.nomMedicament} - {ordonnance.forme}
                  </p>
                </div>

                <div className="bg-[#1e242f] p-4 rounded-lg">
                  <h4 className="text-gray-400 text-sm flex items-center gap-2 mb-2">
                    <Timer className="w-4 h-4 text-green-400" />
                    Dosage
                  </h4>
                  <p className="text-white font-medium">{ordonnance.dosage}</p>
                </div>

                <div className="bg-[#1e242f] p-4 rounded-lg">
                  <h4 className="text-gray-400 text-sm flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-orange-400" />
                    Posologie
                  </h4>
                  <p className="text-white font-medium">
                    {ordonnance.posologie}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#1e242f] p-4 rounded-lg">
                  <h4 className="text-gray-400 text-sm flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-yellow-400" />
                    Durée du traitement
                  </h4>
                  <p className="text-white font-medium">{ordonnance.duree}</p>
                </div>

                <div className="bg-[#1e242f] p-4 rounded-lg">
                  <h4 className="text-gray-400 text-sm flex items-center gap-2 mb-2">
                    <Thermometer className="w-4 h-4 text-red-400" />
                    Symptômes traités
                  </h4>
                  <p className="text-white font-medium">
                    {ordonnance.symptoms}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <button
                className="w-full bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                onClick={() => handleSaveOrdonnance(ordonnance)}
              >
                <Save className="w-5 h-5" />
                Sauvegarder l'ordonnance
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ordonnance;
