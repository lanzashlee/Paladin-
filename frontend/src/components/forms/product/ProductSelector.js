import React from 'react';

function ProductSelector({ products, selectedProduct, onSelect, onBack, onNext }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedProduct) {
      onNext();
    }
  };

  return (
    <form className="quote-request__selector" onSubmit={handleSubmit}>
      <div className="quote-request__selector-top">
        <div>
          <h3>Select Insurance Type</h3>
          <p>Choose one line to continue with product-specific questions.</p>
        </div>
      </div>
      <div className="quote-request__product-grid">
        {products.map((product) => (
          <button
            key={product.id}
            className={`quote-request__product-card${selectedProduct === product.id ? ' is-selected' : ''}`}
            type="button"
            onClick={() => onSelect(product.id)}
          >
            <span className="quote-request__product-title">{product.label}</span>
            <span className="quote-request__product-description">{product.description}</span>
          </button>
        ))}
      </div>
      <div className="quote-request__actions">
        <button className="quote-request__secondary" type="button" onClick={onBack}>
          Back
        </button>
        <button type="submit" disabled={!selectedProduct}>
          Continue
        </button>
      </div>
    </form>
  );
}

export default ProductSelector;
