import React from 'react';

function HO3Form({ onBack }) {
  return (
    <section className="quote-request__placeholder">
      <h3>Homeowners Insurance (HO3)</h3>
      <p>Form scaffold is ready. We can now add HO3-specific underwriting fields.</p>
      <button type="button" onClick={onBack}>Back to Insurance Selection</button>
    </section>
  );
}

export default HO3Form;
