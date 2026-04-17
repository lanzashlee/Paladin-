import React from 'react';

function GeneralLiabilityForm({ onBack }) {
  return (
    <section className="quote-request__placeholder">
      <h3>General Liability Insurance (GL / CGL)</h3>
      <p>Form scaffold is ready. We can now add GL-specific underwriting fields.</p>
      <button type="button" onClick={onBack}>Back to Insurance Selection</button>
    </section>
  );
}

export default GeneralLiabilityForm;
