import { Calendar, Clock, X, User, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

interface Appointment {
  doctorName: string;
  specialite: string;
  date: string;
  time: string;
}

function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const storedAppointments = localStorage.getItem("appointments");
    if (storedAppointments) {
      setAppointments(JSON.parse(storedAppointments));
    }
  }, []);

  const handleCancelAppointment = async (index: number) => {
    try {
      const appointment = appointments[index];
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      // Supprimer de la table des rendez-vous
      const newAppointments = appointments.filter((_, i) => i !== index);
      setAppointments(newAppointments);
      localStorage.setItem("appointments", JSON.stringify(newAppointments));

      // Supprimer de la table diagnostic
      await fetch(`/api/diagnostics/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorName: appointment.doctorName,
          date: appointment.date,
        }),
      });

      // Mettre à jour le statut dans la table médecin
      await fetch(`/api/doctors/appointments/${appointment.doctorName}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: user.id,
          appointmentDate: appointment.date,
        }),
      });

      toast.success("Rendez-vous annulé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
      toast.error("Erreur lors de l'annulation du rendez-vous");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1e242f] rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Mes Rendez-vous</h2>
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <p className="text-gray-400">Aucun rendez-vous programmé</p>
          ) : (
            appointments.map((appointment, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-[#2a303c] p-6 rounded-xl text-white border border-gray-700 hover:border-blue-500 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      Dr. {appointment.doctorName}
                    </p>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {appointment.specialite}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="flex items-center gap-2 text-blue-400">
                      <Calendar className="w-4 h-4" />
                      {appointment.date}
                    </p>
                    <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4" />
                      {appointment.time}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCancelAppointment(index)}
                    className="bg-red-500/10 text-red-500 px-6 py-3 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Annuler
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Appointments;
