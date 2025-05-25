import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  Brain,
  MessageCircle,
  Loader2,
  RotateCcw,
  Stethoscope,
  Bot, // Add this import instead of Robot
} from "lucide-react";
import findSpecialist from "../../../Services/SendDiagnostic/SendDiagnostic";
import { Doctor } from "../../../Types/Doctor";

const API_URL = "/api/mediguide"; // Plus besoin de "http://localhost:5000"

interface Message {
  type: "question" | "answer" | "diagnostic";
  content: string;
  timestamp?: string;
}

interface ConversationData {
  symptom1?: { question: string; answer: string };
  symptom2?: { question: string; answer: string };
  symptom3?: { question: string; answer: string };
  symptom4?: { question: string; answer: string };
  symptom5?: { question: string; answer: string };
  symptom6?: { question: string; answer: string };
  symptom7?: { question: string; answer: string };
  result?: string;
}

const ChatBot: React.FC = () => {
  // Add this with other state declarations
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<ConversationData>({});
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [showDoctorAssignment, setShowDoctorAssignment] = useState(false);
  const [assignedDoctor, setAssignedDoctor] = useState<Doctor | null>(null);
  const [showAppointmentConfirm, setShowAppointmentConfirm] = useState(false); // Add this line
  const [appointmentDateTime, setAppointmentDateTime] = useState<{
    date: string;
    time: string;
  } | null>(null);

  // Add this function with other function declarations
  const handleAppointmentConfirm = async () => {
    try {
      if (!assignedDoctor || !appointmentDateTime) return;

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const appointment = {
        doctorName: assignedDoctor.noms,
        specialite: assignedDoctor.specialite,
        date: appointmentDateTime.date,
        time: appointmentDateTime.time,
      };

      // Get existing appointments or initialize empty array
      const existingAppointments = JSON.parse(
        localStorage.getItem("appointments") || "[]"
      );

      // Add new appointment
      localStorage.setItem(
        "appointments",
        JSON.stringify([...existingAppointments, appointment])
      );

      setMessages((prev) => [
        ...prev,
        {
          type: "diagnostic",
          content: `✅ Rendez-vous confirmé avec Dr. ${assignedDoctor.noms} pour le ${appointmentDateTime.date} à ${appointmentDateTime.time}`,
          timestamp: new Date().toISOString(),
        },
      ]);

      setShowAppointmentConfirm(false);
      toast.success("Rendez-vous confirmé avec succès!");
    } catch (error) {
      toast.error("Erreur lors de la confirmation du rendez-vous");
    }
  };

  const handleAssignDoctor = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");

      if (!conversation.result) {
        toast.error("Diagnostic non disponible");
        return;
      }

      if (!userData || !userData.id) {
        toast.error("Informations patient non disponibles");
        return;
      }

      const doctor = await findSpecialist({
        symptoms: conversation.result,
        specialiste: "generaliste",
        patient: {
          noms: userData.noms,
          email: userData.email,
          phone: userData.phone,
        },
      });

      if (doctor) {
        setAssignedDoctor(doctor);
        const now = new Date();
        const date = now.toLocaleDateString("fr-FR");
        const time = now.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        setAppointmentDateTime({ date, time });

        toast.success(`Dr. ${doctor.noms} a été assigné à votre cas`);
        setMessages((prev) => [
          ...prev,
          {
            type: "diagnostic",
            content: `Un médecin vous a été assigné: Dr. ${doctor.noms} (${doctor.specialite})`,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        toast.error("Aucun médecin disponible pour votre cas");
        setMessages((prev) => [
          ...prev,
          {
            type: "diagnostic",
            content: `Nous n'avons pas trouvé de médecin disponible pour votre cas actuellement. 
            \nVeuillez nous contacter par email à support@mediconsult.com pour une assistance personnalisée.
            \nNous vous répondrons dans les plus brefs délais.`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche du spécialiste:", error);
      toast.error("Erreur lors de l'attribution du médecin");
    }
  };

  const handleSubmit = async () => {
    if (!currentInput.trim()) {
      toast.error("Veuillez entrer une réponse");
      return;
    }

    setIsLoading(true);
    const newMessage: Message = {
      type: "answer",
      content: currentInput,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    try {
      const response = await fetch(`${API_URL}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: currentInput }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to process answer");
      }

      // Store current Q&A pair
      setConversation((prev) => ({
        ...prev,
        [`symptom${currentQuestionNumber}`]: {
          question: messages[messages.length - 1]?.content || "",
          answer: currentInput,
        },
      }));

      if (currentQuestionNumber === 7) {
        // Store the final diagnostic result
        const finalResult = data.question || data.diagnostic;
        setConversation((prev) => ({
          ...prev,
          result: finalResult,
        }));

        // Add diagnostic message to chat
        const diagnosticMessage: Message = {
          type: "diagnostic",
          content: finalResult,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, diagnosticMessage]);

        // Log complete conversation with final result
        console.log("Complete Diagnostic Session:", {
          ...conversation,
          result: finalResult,
        });
      } else if (data.question) {
        const questionMessage: Message = {
          type: "question",
          content: data.question,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, questionMessage]);
        setCurrentQuestionNumber((prev) => prev + 1);
      }

      setCurrentInput("");
    } catch (error) {
      console.error("Error in chat:", error);
      toast.error("Erreur lors de l'analyse");
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = async () => {
    try {
      const response = await fetch(`${API_URL}/reset`, { method: "POST" });
      const data = await response.json();

      if (data.success) {
        setMessages([{ type: "question", content: data.question }]);
      } else {
        throw new Error(data.error || "Failed to reset chat");
      }
    } catch (error) {
      toast.error("Erreur lors de la réinitialisation");
    }
  };

  return (
    <div className="h-[600px] bg-white rounded-lg p-6 flex flex-col border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800">
            Bonjour ! Je suis votre assistant médical
          </h2>
        </div>
        <button
          onClick={resetChat}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title="Nouveau diagnostic"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 rounded-xl mb-6">
        <div className="flex items-start gap-3">
          <Stethoscope className="w-6 h-6 text-green-500 mt-1" />
          <p className="text-gray-600">
            Je vous invite à bien répondre aux questions pour nous permettre
            d'établir un diagnostic adapté à votre situation.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              message.type === "answer" ? "justify-end" : ""
            }`}
          >
            {message.type !== "answer" && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`rounded-lg p-4 max-w-[80%] ${
                message.type === "answer"
                  ? "bg-blue-100 text-blue-800"
                  : message.type === "diagnostic"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="whitespace-pre-line">{message.content}</p>
            </div>
            {message.type === "answer" && (
              <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-blue-500" />
              </div>
            )}
          </div>
        ))}

        {currentQuestionNumber === 7 && !assignedDoctor && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleAssignDoctor}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Trouver un médecin spécialiste
            </button>
          </div>
        )}

        {assignedDoctor && !showAppointmentConfirm && (
          <div className="bg-blue-100 p-4 rounded-lg mt-4 border border-blue-200">
            <h3 className="text-blue-800 font-semibold mb-2">
              Médecin assigné: Dr. {assignedDoctor.noms}
            </h3>
            <p className="text-gray-600 mb-2">
              Spécialité: {assignedDoctor.specialite}
            </p>
            <p className="text-gray-600 mb-3">
              Date proposée: {appointmentDateTime?.date} à{" "}
              {appointmentDateTime?.time}
            </p>
            <button
              onClick={() => setShowAppointmentConfirm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Confirmer le rendez-vous
            </button>
          </div>
        )}

        {showAppointmentConfirm && assignedDoctor && (
          <div className="bg-green-100 p-4 rounded-lg mt-4 border border-green-300">
            <h3 className="text-green-800 font-semibold mb-2">
              Confirmer le rendez-vous avec Dr. {assignedDoctor.noms}
            </h3>
            <p className="text-gray-700 mb-3">
              Pour le {appointmentDateTime?.date} à {appointmentDateTime?.time}
            </p>
            <div className="flex gap-3 mt-3">
              <button
                onClick={handleAppointmentConfirm}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Confirmer
              </button>
              <button
                onClick={() => setShowAppointmentConfirm(false)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSubmit()}
          placeholder="Répondez à la question..."
          className="flex-1 bg-white text-gray-800 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Envoyer"}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
