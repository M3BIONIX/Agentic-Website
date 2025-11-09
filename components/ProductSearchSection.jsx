export function ProductSearchSection() {
  return (
    <section className="card" id="search-section">
      <h2>Product Search</h2>
      <p>Type in a product name and let the agent trigger the search workflow.</p>
      <div>
        <label htmlFor="search-input">Search products</label>
        <input type="text" id="search-input" placeholder="Search products..." />
      </div>
      <button id="search-btn" type="button">
        Search
      </button>
      <div id="search-results" className="status info" aria-live="polite">
        Start searching to see results.
      </div>
    </section>
  );
}


