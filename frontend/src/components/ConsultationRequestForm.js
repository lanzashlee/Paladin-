import React, { useState } from 'react';
import RequestModal from './RequestModal';
import FieldGroup, { inputClassName } from './RequestFormField';

function ConsultationRequestForm({ onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverageType: '',
    preferredContact: 'email',
    timeline: 'This week',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    Object.entries(formData).forEach(([field, value]) => {
      if (!value.trim()) {
        newErrors[field] = 'This field is required.';
      }
    });

    return newErrors;
  };

  const getFieldClass = (field) =>
    errors[field]
      ? `${inputClassName} border-red-500 focus:ring-red-300 focus:border-red-500`
      : inputClassName;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSaved(false);
    setSubmitError(null);
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSaved(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        coverageType: '',
        preferredContact: 'email',
        timeline: 'This week',
        notes: '',
      });
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequestModal
      badge="Consultation"
      title="Personalized Consultation"
      description="Use this form to outline the kind of coverage you want, how you prefer to be contacted, and when you need help."
      onClose={onClose}
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5 md:grid-cols-2">
          <FieldGroup label="Full name" htmlFor="consultation-fullName" required error={errors.fullName}>
            <input
              id="consultation-fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className={getFieldClass('fullName')}
              disabled={loading}
            />
          </FieldGroup>

          <FieldGroup label="Email address" htmlFor="consultation-email" required error={errors.email}>
            <input
              id="consultation-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={getFieldClass('email')}
              disabled={loading}
            />
          </FieldGroup>

          <FieldGroup label="Phone number" htmlFor="consultation-phone" required error={errors.phone}>
            <input
              id="consultation-phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(555) 555-5555"
              className={getFieldClass('phone')}
              disabled={loading}
            />
          </FieldGroup>

          <FieldGroup label="Preferred contact" htmlFor="consultation-preferredContact" required error={errors.preferredContact}>
            <select
              id="consultation-preferredContact"
              name="preferredContact"
              value={formData.preferredContact}
              onChange={handleChange}
              className={getFieldClass('preferredContact')}
              disabled={loading}
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="text">Text message</option>
            </select>
          </FieldGroup>

          <FieldGroup label="Coverage focus" htmlFor="consultation-coverageType" required error={errors.coverageType}>
            <select
              id="consultation-coverageType"
              name="coverageType"
              value={formData.coverageType}
              onChange={handleChange}
              className={getFieldClass('coverageType')}
              disabled={loading}
            >
              <option value="">Select coverage</option>
              <option value="personal-auto">Personal auto</option>
              <option value="homeowners">Homeowners</option>
              <option value="renters">Renters</option>
              <option value="business">Business</option>
              <option value="life">Life</option>
              <option value="other">Other</option>
            </select>
          </FieldGroup>

          <FieldGroup label="Timeline" htmlFor="consultation-timeline" required error={errors.timeline}>
            <select
              id="consultation-timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              className={getFieldClass('timeline')}
              disabled={loading}
            >
              <option value="This week">This week</option>
              <option value="Within 30 days">Within 30 days</option>
              <option value="Just exploring">Just exploring</option>
            </select>
          </FieldGroup>
        </div>

        <FieldGroup label="What do you want to cover?" htmlFor="consultation-notes" required error={errors.notes}>
          <textarea
            id="consultation-notes"
            name="notes"
            rows="5"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Tell us what kind of protection you need, who needs coverage, and any details that matter."
            className={`${getFieldClass('notes')} resize-none`}
            disabled={loading}
          />
        </FieldGroup>

        {saved && (
          <div className="rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
            Your consultation request has been submitted successfully! We'll be in touch soon.
          </div>
        )}

        {submitError && (
          <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error: {submitError}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full border border-[#d8cbb8] px-6 py-3 text-sm font-semibold text-[#012E72] transition-colors hover:bg-[#F7F4EF] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Close
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-[#012E72] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#012E72]/15 transition-colors hover:bg-[#002DB5] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </RequestModal>
  );
}

export default ConsultationRequestForm;