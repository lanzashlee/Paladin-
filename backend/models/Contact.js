const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
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
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
