export function CartSection() {
  return (
    <section className="card" id="cart-section">
      <h2>Shopping Cart</h2>
      <p>The agent can add products to this cart. View the simulated contents below.</p>
      <div id="cart-items" className="cart-items">
        <p>Cart is empty</p>
      </div>
      <div id="cart-total" className="status info" aria-live="polite" />
    </section>
  );
}


