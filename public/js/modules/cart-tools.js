import { setStatus, updateLastEvent } from '../ui/status.js';
import { log } from '../utils/logger.js';
import { dispatchSuccess, dispatchError } from '../utils/agent-events.js';

const TOOL_ADD_TO_CART = 'add_to_cart';

/**
 * Read cart items from localStorage.
 * @returns {Array<{productId: string, quantity: number}>}
 */
function readCart() {
  try {
    return JSON.parse(window.localStorage.getItem('cart') ?? '[]');
  } catch (error) {
    log(`Failed to parse cart data: ${error.message}`, 'error');
    return [];
  }
}

/**
 * Persist cart items to localStorage.
 * @param {Array<{productId: string, quantity: number}>} cart
 */
function writeCart(cart) {
  window.localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Render cart data on the page.
 * @param {Array<{productId: string, quantity: number}>} cart
 */
export function updateCartUI(cart) {
  const cartItemsEl = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');

  if (!cartItemsEl || !cartTotalEl) {
    return;
  }

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p>Cart is empty</p>';
    cartTotalEl.textContent = '';
    return;
  }

  cartItemsEl.innerHTML = cart.map((item) => `<div>Product ${item.productId} x ${item.quantity}</div>`).join('');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartTotalEl.textContent = `Total items: ${totalItems}`;
}

/**
 * Handle agent request to add an item to the cart.
 * @param {CustomEvent} event
 */
function handleAddToCart(event) {
  const args = event.detail?.args ?? {};
  const productId = args.productId;
  const quantity = Number(args.quantity ?? 1);

  if (!productId) {
    const errorMessage = 'Product ID is required to add to cart';
    setStatus(errorMessage, 'error');
    dispatchError(TOOL_ADD_TO_CART, errorMessage);
    log(errorMessage, 'warning');
    updateLastEvent(TOOL_ADD_TO_CART);
    event.preventDefault();
    return;
  }

  const cart = readCart();
  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  writeCart(cart);
  updateCartUI(cart);

  const successMessage = `Added product ${productId} to cart`;
  setStatus(successMessage, 'success');
  dispatchSuccess(TOOL_ADD_TO_CART, { productId, quantity, cart });
  log(successMessage, 'success');
  updateLastEvent(TOOL_ADD_TO_CART);
  event.preventDefault();
}

/**
 * Register cart tool listeners.
 */
export function registerCartTools() {
  const targets = [document, window];
  targets.forEach((target) => {
    target.addEventListener(TOOL_ADD_TO_CART, handleAddToCart);
  });

  updateCartUI(readCart());

  return () => {
    targets.forEach((target) => {
      target.removeEventListener(TOOL_ADD_TO_CART, handleAddToCart);
    });
  };
}
