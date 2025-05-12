import mongoose from 'mongoose';

const OrdonnanceSchema = new mongoose.Schema({
  diagnosticId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Diagnostic', 
    required: true 
  },
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
  },
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  },
  date: { 
    type: String, 
    required: true 
  },
  PatientName: { 
    type: String, 
    required: true 
  },
  DoctorName: { 
    type: String, 
    required: true 
  },
  medications: [{
    nomMedicament: { 
      type: String, 
      required: true 
    },
    forme: { 
      type: String, 
      enum: ['comprimé', 'sirop', 'solution', 'pommade', 'injection'],
      required: true 
    },
    dosage: { 
      type: String, 
      required: true 
    },
    posologie: { 
      type: String, 
      required: true 
    },
    duree: { 
      type: String, 
      required: true 
    }
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, { 
  timestamps: true 
});

export default mongoose.model('Ordonnance', OrdonnanceSchema);