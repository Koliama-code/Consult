import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  noms: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  dateNaissance: { type: Date },
  sexe: { type: String },
  adresse: { type: String },
  diagnostics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Diagnostic' }]
}, { timestamps: true });

export default mongoose.model('Patient', PatientSchema);