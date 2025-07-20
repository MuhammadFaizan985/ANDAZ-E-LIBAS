// Cart functionality for AndazLibas
// Handles quantity changes, updates totals, and loads cart from localStorage

function isCartPage() {
  return window.location.pathname.includes('cart.html');
}
function isHomePage() {
  return window.location.pathname.includes('index.html');
}

if (isCartPage()) {
  document.addEventListener('DOMContentLoaded', function() {
    function renderCart() {
      const cartContainer = document.querySelector('.space-y-6');
      if (!cartContainer) return;
      cartContainer.innerHTML = '';
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="text-center text-[var(--text-secondary)] py-8">Your cart is empty.</div>';
      }
      cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item rounded-lg border border-[var(--border-color)] bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4';
        cartItem.setAttribute('data-id', item.id);
        cartItem.innerHTML = `
          <div class="h-24 w-24 flex-shrink-0">
            <img alt="${item.name}" class="h-full w-full rounded-lg object-cover" src="${item.image}"/>
          </div>
          <div class="flex flex-1 flex-col justify-between w-full">
            <div>
              <h3 class="text-lg font-semibold text-[var(--text-primary)]">${item.name}</h3>
              <p class="mt-1 text-sm text-[var(--text-secondary)]">Size: ${item.size || ''}</p>
            </div>
            <div class="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2">
              <div class="flex items-center gap-2">
                <button class="decrement-btn h-6 w-6 rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--secondary-color)]" aria-label="Decrease quantity">-</button>
                <span class="quantity w-8 text-center text-sm">${item.qty}</span>
                <button class="increment-btn h-6 w-6 rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--secondary-color)]" aria-label="Increase quantity">+</button>
              </div>
              <p class="item-price text-lg font-semibold text-[var(--text-primary)]">$${item.price.toFixed(2)}</p>
            </div>
          </div>
        `;
        cartContainer.appendChild(cartItem);
      });
      attachCartListeners();
      updateTotals();
      updateCartCount();
    }

    function attachCartListeners() {
      document.querySelectorAll('.decrement-btn').forEach(btn => {
        btn.onclick = function() {
          const qtySpan = this.parentElement.querySelector('.quantity');
          let qty = parseInt(qtySpan.textContent);
          if (qty > 1) {
            qty--;
            const id = this.closest('.cart-item').getAttribute('data-id');
            updateCartStorage(id, qty);
          }
        };
      });
      document.querySelectorAll('.increment-btn').forEach(btn => {
        btn.onclick = function() {
          const qtySpan = this.parentElement.querySelector('.quantity');
          let qty = parseInt(qtySpan.textContent);
          qty++;
          const id = this.closest('.cart-item').getAttribute('data-id');
          updateCartStorage(id, qty);
        };
      });
    }

    function updateCartStorage(id, qty) {
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart = cart.map(item => item.id == id ? { ...item, qty } : item);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    }

    function updateTotals() {
      let subtotal = 0;
      document.querySelectorAll('.cart-item').forEach(item => {
        const price = parseFloat(item.querySelector('.item-price').textContent.replace('$',''));
        const qty = parseInt(item.querySelector('.quantity').textContent);
        subtotal += price * qty;
      });
      const subtotalEl = document.getElementById('cart-subtotal');
      if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
      const tax = subtotal * 0.08;
      const taxEl = document.getElementById('cart-tax');
      if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
      const totalEl = document.getElementById('cart-total');
      if (totalEl) totalEl.textContent = `$${(subtotal + tax).toFixed(2)}`;
    }

    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((sum, item) => sum + item.qty, 0);
      const countEl = document.getElementById('cart-count');
      if (countEl) countEl.textContent = count;
    }

    renderCart();
  });
}

if (isHomePage()) {
  window.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const product = {
          id: this.getAttribute('data-id'),
          name: this.getAttribute('data-name'),
          price: parseFloat(this.getAttribute('data-price')),
          image: this.getAttribute('data-image'),
          size: this.getAttribute('data-size') || '',
          qty: 1
        };
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(item => item.id == product.id);
        if (existing) {
          existing.qty++;
        } else {
          cart.push(product);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        // Update cart count in header
        const countEl = document.getElementById('cart-count');
        if (countEl) {
          const count = cart.reduce((sum, item) => sum + item.qty, 0);
          countEl.textContent = count;
        }
      });
    });
  });
}

// Always update cart count in header on any page
window.addEventListener('DOMContentLoaded', function() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const countEl = document.getElementById('cart-count');
  if (countEl) countEl.textContent = count;
});
