import React from 'react';

function WorkersCompForm({ onBack }) {
  return (
    <section className="quote-request__placeholder">
      <h3>Workers Compensation Insurance</h3>
      <p>Form scaffold is ready. We can now add payroll and class code fields.</p>
      <button type="button" onClick={onBack}>Back to Insurance Selection</button>
    </section>
  );
}

export default WorkersCompForm;
