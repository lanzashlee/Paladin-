const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String },
  fullName: { type: String },
  email: { type: String },
  subject: { type: String },
  message: { type: String },
  phone: { type: String },
  policyNumber: { type: String },
  effectiveDate: { type: String },
  coverageType: { type: String },
  preferredContact: { type: String, default: 'email' },
  deliveryMethod: { type: String },
  documentType: { type: String },
  changeType: { type: String },
  timeline: { type: String },
  notes: { type: String },
  formType: {
    type: String,
    default: 'consultation',
    enum: ['consultation', 'document-request', 'policy-change', 'update-contact-info', 'call-request', 'claim-report'],
  },
  updateType: { type: String },
  updatedValue: { type: String },
  preferredDay: { type: String },
  preferredTime: { type: String },
  topic: { type: String },
  incidentDate: { type: String },
  claimType: { type: String },
  incidentLocation: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
