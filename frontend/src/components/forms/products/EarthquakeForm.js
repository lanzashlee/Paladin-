import React from 'react';

function EarthquakeForm({ onBack }) {
  return (
    <section className="quote-request__placeholder">
      <h3>Earthquake Insurance</h3>
      <p>Form scaffold is ready. We can now add earthquake exposure fields.</p>
      <button type="button" onClick={onBack}>Back to Insurance Selection</button>
    </section>
  );
}

export default EarthquakeForm;
