import React from 'react';

function SpecialtyForm({ onBack }) {
  return (
    <section className="quote-request__placeholder">
      <h3>Specialty Products</h3>
      <p>Form scaffold is ready. We can now add specialty product sub-type logic.</p>
      <button type="button" onClick={onBack}>Back to Insurance Selection</button>
    </section>
  );
}

export default SpecialtyForm;
