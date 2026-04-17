import React from 'react';

function UmbrellaForm({ onBack }) {
  return (
    <section className="quote-request__placeholder">
      <h3>Umbrella / Excess Liability Insurance</h3>
      <p>Form scaffold is ready. We can now add underlying limit details.</p>
      <button type="button" onClick={onBack}>Back to Insurance Selection</button>
    </section>
  );
}

export default UmbrellaForm;
