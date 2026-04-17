import React from 'react';

function FloodForm({ onBack }) {
  return (
    <section className="quote-request__placeholder">
      <h3>Flood Insurance</h3>
      <p>Form scaffold is ready. We can now add flood zone and elevation fields.</p>
      <button type="button" onClick={onBack}>Back to Insurance Selection</button>
    </section>
  );
}

export default FloodForm;
