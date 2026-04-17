import React from 'react';

function CommercialAutoForm({ onBack }) {
  return (
    <section className="quote-request__placeholder">
      <h3>Commercial Auto Insurance</h3>
      <p>Form scaffold is ready. We can now add commercial auto-specific fields.</p>
      <button type="button" onClick={onBack}>Back to Insurance Selection</button>
    </section>
  );
}

export default CommercialAutoForm;
