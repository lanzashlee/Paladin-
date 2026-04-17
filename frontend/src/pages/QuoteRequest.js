import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './QuoteRequest.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UniversalApplicantForm from '../components/forms/universal/UniversalApplicantForm';
import ProductSelector from '../components/forms/product/ProductSelector';
import {
  PRODUCT_OPTIONS,
  PRODUCT_FORM_COMPONENTS,
} from '../components/forms/products/productForms';

function QuoteRequest() {
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    contactPhone: '',
    emailAddress: '',
    mailingStreet: '',
    mailingCity: '',
    mailingState: '',
    mailingZip: '',
    ssnLast4: '',
    fullSsn: '',
    maritalStatus: '',
    gender: '',
    preferredLanguage: '',
    priorInsuranceCarrier: '',
    priorPolicyDate: '',
    priorPolicyReason: '',
    priorPolicyReasonDetails: '',
    claimsHistory: [{ date: '', type: '', paidAmount: '' }],
    consentSoftCredit: false,
    consentElectronicDelivery: false,
    electronicSignature: '',
    applicantNotes: '',
  });
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFinalSubmit = () => {
    // TODO: Send full package to backend (universal + selected insurance details)
    setSubmitted(true);
  };

  const SelectedProductForm = selectedProduct
    ? PRODUCT_FORM_COMPONENTS[selectedProduct]
    : null;

  return (
    <>
      <Header />
      <section className="quote-request">
        <div className="quote-request__hero">
          <p className="quote-request__eyebrow">Paladin Professional Insurance Solutions</p>
          <h2>Request a Quote</h2>
          <p className="quote-request__subtitle">
            Complete the universal applicant form first, then continue to your insurance-specific form.
          </p>
          <p className="quote-request__step-label">Step {submitted ? 3 : step} of 3</p>
        </div>
        {submitted ? (
          <div className="quote-request__success">Thank you! We will contact you soon.</div>
        ) : step === 1 ? (
          <>
            <div className="quote-request__external-shortcut-wrap">
              <p className="quote-request__consultation-copy">
                Have no time filling out this form? Start a{' '}
                <Link className="quote-request__consultation-shortcut" to="/contact?request=consultation">
                  Personalized Consultation
                </Link>{' '}
                instead.
              </p>
            </div>
            <UniversalApplicantForm
              form={form}
              onNext={(universalForm) => {
                setForm(universalForm);
                setStep(2);
              }}
            />
          </>
        ) : step === 2 ? (
          <ProductSelector
            products={PRODUCT_OPTIONS}
            selectedProduct={selectedProduct}
            onSelect={setSelectedProduct}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        ) : SelectedProductForm ? (
          <>
            <SelectedProductForm onBack={() => setStep(2)} />
            <div className="quote-request__actions quote-request__actions--final">
              <button className="quote-request__secondary" type="button" onClick={() => setStep(2)}>
                Change Insurance Type
              </button>
              <button type="button" onClick={handleFinalSubmit}>
                Submit Application
              </button>
            </div>
          </>
        ) : (
          <div className="quote-request__error">Please select an insurance type to continue.</div>
        )}
      </section>
      <Footer />
    </>
  );
}

export default QuoteRequest;
