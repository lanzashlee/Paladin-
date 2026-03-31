import React, { useState } from 'react';
import './PolicyManagement.css';

const mockPolicies = [
  { id: 1, type: 'Auto', status: 'Active', renewal: '2026-12-01' },
  { id: 2, type: 'Home', status: 'Active', renewal: '2027-03-15' },
];

function PolicyManagement() {
  const [policies] = useState(mockPolicies);

  return (
    <section className="policy-management">
      <h2>Your Policies</h2>
      <table className="policy-table">
        <thead>
          <tr>
            <th>Policy ID</th>
            <th>Type</th>
            <th>Status</th>
            <th>Renewal Date</th>
          </tr>
        </thead>
        <tbody>
          {policies.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.type}</td>
              <td>{p.status}</td>
              <td>{p.renewal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default PolicyManagement;
