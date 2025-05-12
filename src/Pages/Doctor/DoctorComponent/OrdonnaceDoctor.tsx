import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PatientDiagnostic } from "../../../Types/Doctor";
import Ordonnance from "../../../Types/Ordonnance";
import { getPatientFromOrdonnance } from "../../../Services/RecuperePatient/RecupererPatient";
import sendOrdonnance from "../../../Services/SendOrdonnance/SendOrdonnance";
import { useState } from "react";
import { toast } from "react-toastify";
// import { useAuth } from "../../../Context/AuthContext"; // Add this import at the top

interface OrdonnaceDoctorProps {
  diagnostic?: PatientDiagnostic;
  doctorName?: string;
  onPrescriptionComplete?: () => void; // Ajout de la nouvelle prop
}

interface OrdonnanceFormData {
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  symptoms: string;
  doctorName: string;
  medicament: string;
  forme: string;
  dosage: string;
  posologie: string;
  duree: string;
}

const OrdonnaceDoctor: React.FC<OrdonnaceDoctorProps> = ({
  diagnostic,
  doctorName,
  onPrescriptionComplete,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<OrdonnanceFormData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set doctor name first
        const doctorId = localStorage.getItem("doctorId");
        const doctorResponse = await fetch(
          `http://localhost:3000/doctors/${doctorId}`
        );
        const doctor = await doctorResponse.json();
        setValue("doctorName", `Dr. ${doctor.noms}`);

        // Then fetch patient data if diagnostic exists
        if (diagnostic?.patientName) {
          const patientResponse = await fetch(`http://localhost:3000/patients`);
          const patients = await patientResponse.json();
          const patient = patients.find((p: any) =>
            p.noms.toLowerCase().includes(diagnostic?.patientName.toLowerCase())
          );

          if (patient) {
            setValue("patientName", patient.noms);
            setValue("patientPhone", patient.phone);
            setValue("patientEmail", patient.email);
            setValue("symptoms", diagnostic?.symptoms || "");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Erreur lors de la récupération des données");
      }
    };

    fetchData();
  }, [diagnostic, setValue]);

  // Remove the second useEffect hook that was doing similar work
  const onSubmit = async (data: OrdonnanceFormData) => {
    try {
      const newOrdonnance: Ordonnance = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        PatientName: data.patientName,
        phone: data.patientPhone,
        email: data.patientEmail,
        symptoms: data.symptoms,
        DoctorName: data.doctorName,
        nomMedicament: data.medicament,
        forme: data.forme,
        dosage: data.dosage,
        posologie: data.posologie,
        duree: data.duree,
      };

      // Récupérer le patient et mettre à jour ses ordonnances
      const response = await fetch(`http://localhost:3000/patients`);
      const patients = await response.json();

      const patient = patients.find(
        (p: any) =>
          p.phone === data.patientPhone &&
          p.noms.toLowerCase().includes(data.patientName.toLowerCase())
      );

      if (!patient) {
        toast.error("Patient non trouvé");
        return;
      }

      // Ajouter la nouvelle ordonnance
      const updatedOrdonnances = [...(patient.Ordonnance || []), newOrdonnance];

      // Mettre à jour le patient avec la nouvelle ordonnance
      const updateResponse = await fetch(
        `http://localhost:3000/patients/${patient.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Ordonnance: updatedOrdonnances,
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Échec de la mise à jour du patient");
      }

      // Remove the duplicate call to getPatientFromOrdonnance
      await sendOrdonnance(newOrdonnance);

      // Reset form fields except for patient and doctor info
      reset({
        patientName: data.patientName,
        patientPhone: data.patientPhone,
        patientEmail: data.patientEmail,
        symptoms: data.symptoms,
        doctorName: data.doctorName,
        medicament: "",
        forme: "",
        dosage: "",
        posologie: "",
        duree: "",
      });

      // Mettre à jour le statut du diagnostic
      if (diagnostic?.id) {
        const diagnosticResponse = await fetch(
          `http://localhost:3000/diagnostics/${diagnostic.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "traité",
            }),
          }
        );

        if (!diagnosticResponse.ok) {
          throw new Error("Échec de la mise à jour du statut du diagnostic");
        }
      }

      toast.success("Ordonnance envoyée avec succès!");

      // Appeler le callback après succès
      if (onPrescriptionComplete) {
        onPrescriptionComplete();
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'ordonnance:", error);
      toast.error("Erreur lors de l'envoi de l'ordonnance");
    }
  };

  useEffect(() => {
    // Fetch patient data
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/patients`);
        const patients = await response.json();
        const patient = patients.find((p: any) =>
          p.noms.toLowerCase().includes(diagnostic?.patientName.toLowerCase())
        );

        if (patient) {
          setValue("patientName", patient.noms);
          setValue("patientPhone", patient.phone);
          setValue("patientEmail", patient.email);
          setValue("symptoms", diagnostic?.symptoms || "");
          setValue("doctorName", doctorName || "");
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    if (diagnostic?.patientName) {
      fetchPatientData();
    }
  }, [diagnostic, doctorName, setValue]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e242f] to-[#2a303c] p-8">
      <div className="max-w-9xl mx-auto bg-[#2a303c]/50 rounded-2xl shadow-xl backdrop-blur-sm p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-2 bg-blue-500 rounded-full"></div>
          <h2 className="text-3xl font-bold text-white">Nouvelle Ordonnance</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Patient Information Section */}
          <div className="bg-[#1e242f]/50 p-8 rounded-xl shadow-lg space-y-6 backdrop-blur-sm border border-gray-700/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 bg-green-500 rounded-full"></div>
              <h3 className="text-2xl font-semibold text-white">
                Informations du patient
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Patient Name and Phone in first row */}
              <div className="space-y-2">
                <label className="block text-gray-300 font-medium">
                  Nom du patient
                </label>
                <input
                  {...register("patientName")}
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-[#2a303c] text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-300 font-medium">
                  Téléphone
                </label>
                <input
                  {...register("patientPhone")}
                  type="tel"
                  className="w-full px-4 py-3 rounded-lg bg-[#2a303c] text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-300 font-medium">Email</label>
                <input
                  {...register("patientEmail")}
                  type="email"
                  className="w-full px-4 py-3 rounded-lg bg-[#2a303c] text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-300 font-medium">
                  Nom du docteur
                </label>
                <input
                  {...register("doctorName")}
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-[#2a303c] text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  read
                />
              </div>

              <div className="col-span-2 space-y-2">
                <label className="block text-gray-300 font-medium">
                  Symptômes
                </label>
                <textarea
                  {...register("symptoms")}
                  className="w-full px-4 py-8 rounded-lg bg-[#2a303c] text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  rows={3}
                  read
                />
              </div>
            </div>
          </div>

          {/* Prescription Section */}
          <div className="bg-[#1e242f]/50 p-8 rounded-xl shadow-lg space-y-6 backdrop-blur-sm border border-gray-700/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 bg-purple-500 rounded-full"></div>
              <h3 className="text-2xl font-semibold text-white">
                Prescription
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Medication Name and Form in first row */}
              <div className="space-y-2">
                <label className="block text-gray-300 font-medium">
                  Nom du médicament
                </label>
                <input
                  {...register("medicament")}
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-[#2a303c] text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  placeholder="Nom du médicament"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-300 font-medium">
                  Forme pharmaceutique
                </label>
                <select
                  {...register("forme")}
                  className="w-full px-4 py-3 rounded-lg bg-[#2a303c] text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                >
                  <option value="">Sélectionnez une forme</option>
                  <option value="comprimé">Comprimé</option>
                  <option value="gélule">Gélule</option>
                  <option value="sirop">Sirop</option>
                  <option value="solution">Solution</option>
                  <option value="pommade">Pommade</option>
                </select>
              </div>

              {/* Dosage and Duration in second row */}
              <div className="space-y-2">
                <label className="block text-gray-300 font-medium">
                  Dosage
                </label>
                <input
                  {...register("dosage")}
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-[#2a303c] text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  placeholder="Ex: 500mg"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-300 font-medium">
                  Durée du traitement
                </label>
                <input
                  {...register("duree")}
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-[#2a303c] text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  placeholder="Ex: 7 jours"
                />
              </div>

              {/* Posology full width */}
              <div className="col-span-2 space-y-2">
                <label className="block text-gray-300 font-medium">
                  Posologie
                </label>
                <textarea
                  {...register("posologie")}
                  className="w-full px-4 py-3 rounded-lg bg-[#2a303c] text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  rows={3}
                  placeholder="Ex: 1 comprimé 3 fois par jour"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          >
            Envoyer l'ordonnance
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrdonnaceDoctor;
