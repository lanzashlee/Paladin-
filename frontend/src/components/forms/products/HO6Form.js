import React from 'react';

function HO6Form({ onBack }) {
  return (
    <section className="quote-request__placeholder">
      <h3>Condo Owners Insurance (HO6)</h3>
      <p>Form scaffold is ready. We can now add HO6-specific underwriting fields.</p>
      <button type="button" onClick={onBack}>Back to Insurance Selection</button>
    </section>
  );
}

export default HO6Form;
