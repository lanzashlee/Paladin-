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
import {
  buildQuotationSections,
  buildUniversalSections,
} from '../components/forms/quoteSectionBuilders';

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
  const [selectedProductFormData, setSelectedProductFormData] = useState({});
  const [isSelectedProductFormValid, setIsSelectedProductFormValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const selectedProductLabel = PRODUCT_OPTIONS.find((option) => option.id === selectedProduct)?.label || selectedProduct;
  const universalSections = buildUniversalSections(form);
  const quotationSections = buildQuotationSections(selectedProduct, selectedProductFormData);

  const handlePreview = () => {
    if (!selectedProduct) {
      setSubmitError('Please select an insurance product before previewing.');
      return;
    }

    if (!isSelectedProductFormValid) {
      setSubmitError('Please complete all required quotation fields before previewing.');
      return;
    }

    setSubmitError('');
    setShowPreview(true);
  };

  const handlePreviewFromProductForm = () => {
    setSubmitError('');
    setShowPreview(true);
  };

  const handleFinalSubmit = async () => {
    if (!selectedProduct) {
      setSubmitError('Please select an insurance product before submitting.');
      return;
    }

    if (!isSelectedProductFormValid) {
      setSubmitError('Please complete all required quotation fields before submitting.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    const payload = {
      formType: 'quote-request',
      selectedProduct,
      selectedProductLabel,
      fullName: form.fullLegalName,
      email: form.emailAddress,
      phone: form.contactPhone,
      universalApplicant: form,
      insuranceQuotation: selectedProductFormData,
      universalApplicantSections: universalSections,
      insuranceQuotationSections: quotationSections,
    };

    try {
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let parsed = {};
      try {
        parsed = responseText ? JSON.parse(responseText) : {};
      } catch (_error) {
        parsed = { error: responseText || 'Unexpected server response.' };
      }

      if (!response.ok) {
        throw new Error(parsed.error || `Failed to submit quote request (HTTP ${response.status}).`);
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAnother = () => {
    setSubmitted(false);
    setSelectedProduct('');
    setSelectedProductFormData({});
    setIsSelectedProductFormValid(false);
    setShowPreview(false);
    setSubmitError('');
    setStep(2);
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
          <>
            <div className="quote-request__success">Thank you! We received your quote request.</div>
            <div className="quote-request__actions quote-request__actions--final">
              <button className="quote-request__secondary" type="button" onClick={handleSubmitAnother}>
                Submit Another Insurance Form
              </button>
              <button type="button" onClick={() => setSubmitted(false)}>
                Back to Quote Request
              </button>
            </div>
          </>
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
            onNext={() => {
              setSelectedProductFormData({});
              setIsSelectedProductFormValid(false);
              setShowPreview(false);
              setSubmitError('');
              setStep(3);
            }}
          />
        ) : SelectedProductForm ? (
          <>
            <div style={{ display: showPreview ? 'none' : 'block' }}>
              <SelectedProductForm
                onBack={() => setStep(2)}
                onFormChange={setSelectedProductFormData}
                onValidityChange={setIsSelectedProductFormValid}
                onPreviewRequest={handlePreviewFromProductForm}
              />
            </div>
            {showPreview ? (
              <div className="quote-request__form quote-request__preview">
                <h3>Application Preview</h3>
                <p className="quote-request__form-intro">
                  Review all entered details below before submitting.
                </p>

                <div className="quote-request__section">
                  <h4 className="quote-request__section-title">Universal Applicant Form</h4>
                  {universalSections.map((section) => (
                    <div className="quote-request__preview-section" key={`universal-${section.title}`}>
                      <h5 className="quote-request__preview-section-title">{section.title}</h5>
                      <div className="quote-request__preview-table">
                        {section.fields.map((field) => (
                          <div className="quote-request__preview-row" key={`universal-${section.title}-${field.label}`}>
                            <div className="quote-request__preview-label">{field.label}</div>
                            <div className="quote-request__preview-value">{field.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="quote-request__section">
                  <h4 className="quote-request__section-title">{selectedProductLabel} Quotation Form</h4>
                  {quotationSections.map((section) => (
                    <div className="quote-request__preview-section" key={`quotation-${section.title}`}>
                      <h5 className="quote-request__preview-section-title">{section.title}</h5>
                      <div className="quote-request__preview-table">
                        {section.fields.map((field) => (
                          <div className="quote-request__preview-row" key={`quotation-${section.title}-${field.label}`}>
                            <div className="quote-request__preview-label">{field.label}</div>
                            <div className="quote-request__preview-value">{field.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {submitError ? (
              <div className="quote-request__error" role="alert">
                {submitError}
              </div>
            ) : null}
            <div className="quote-request__actions quote-request__actions--final">
              {showPreview ? (
                <>
                  <button className="quote-request__secondary" type="button" onClick={() => setShowPreview(false)}>
                    Back to Edit Form
                  </button>
                  <button type="button" onClick={handleFinalSubmit} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </>
              ) : (
                <>
                  <button className="quote-request__secondary" type="button" onClick={() => setStep(2)}>
                    Change Insurance Type
                  </button>
                  <button type="button" onClick={handlePreview}>
                    Preview Application
                  </button>
                </>
              )}
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
