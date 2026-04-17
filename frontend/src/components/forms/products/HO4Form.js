import React from 'react';

function HO4Form({ onBack }) {
  return (
    <section className="quote-request__placeholder">
      <h3>Renters Insurance (HO4)</h3>
      <p>Form scaffold is ready. We can now add HO4-specific underwriting fields.</p>
      <button type="button" onClick={onBack}>Back to Insurance Selection</button>
    </section>
  );
}

export default HO4Form;
