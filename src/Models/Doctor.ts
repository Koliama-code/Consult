import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  noms: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialite: { type: String, required: true },
  phone: { type: String, required: true },
  disponibilite: [{
    jour: String,
    heureDebut: String,
    heureFin: String
  }],
  diagnostics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Diagnostic' }]
}, { timestamps: true });

export default mongoose.model('Doctor', DoctorSchema);