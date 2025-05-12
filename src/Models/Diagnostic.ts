import mongoose from 'mongoose';

const DiagnosticSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  patientName: { type: String, required: true },
  date: { type: String, required: true },
  symptoms: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['en_attente', 'traité'],
    default: 'en_attente'
  },
  ordonnance: {
    nomMedicament: String,
    forme: String,
    dosage: String,
    posologie: String,
    duree: String
  },
  DoctorName: String
}, { timestamps: true });

export default mongoose.model('Diagnostic', DiagnosticSchema);