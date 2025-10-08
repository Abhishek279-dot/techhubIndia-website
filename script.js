var swiper = new Swiper(".top-slider", {
  slidesPerView: 1,
  loop: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// Banner Image Swiper
var bannerImageSwiper = new Swiper(".banner-image-swiper", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 0,
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".banner-image-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".banner-image-swiper .swiper-button-next",
    prevEl: ".banner-image-swiper .swiper-button-prev",
  },
  speed: 800,
});

// Dropdown Functions
function toggleDropdown(dropdownId) {
  var dropdown = document.getElementById(dropdownId);
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

function selectBrand(brandName) {
  document.querySelector('#brandDropdown').previousElementSibling.innerHTML = brandName + ' ▼';
  document.getElementById('brandDropdown').style.display = 'none';
}

function selectDevice(deviceName) {
  document.querySelector('#deviceDropdown').previousElementSibling.innerHTML = deviceName + ' ▼';
  document.getElementById('deviceDropdown').style.display = 'none';
}

// Close dropdowns when clicking outside
window.onclick = function(event) {
  if (!event.target.matches('.dropdown-btn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      dropdowns[i].style.display = "none";
    }
  }
}

// -----------------
// ✅ Tab Function
// -----------------
function openTab(evt, tabName) {
  // Hide all tab-content
  let tabcontent = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove active from all tab-buttons
  let tablinks = document.getElementsByClassName("tab-button");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  // Show the clicked tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.classList.add("active");
}









// Products section scroll function
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Alternative method - simple scroll
function goToProducts() {
    document.getElementById('products').scrollIntoView();
}











// ========== CART MANAGEMENT ==========
class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
        this.isCartOpen = false;
        this.updateCartCount();
        this.createCartModal();
    }
    
    addToCart(product) {
        const quantity = parseInt(document.getElementById('quantity')?.value) || 1;
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...product,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showNotification('Product added to cart!');
        console.log('Cart updated:', this.cart); // Debug के लिए
    }
    
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
    }
    
    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item && newQuantity > 0) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartCount();
            this.updateCartDisplay();
        }
    }
    
    saveCart() {
        localStorage.setItem('shopping-cart', JSON.stringify(this.cart));
    }
    
    loadCart() {
        const savedCart = localStorage.getItem('shopping-cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }
    
    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = count;
        });
    }
    
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    toggleCart() {
        this.isCartOpen = !this.isCartOpen;
        const cartModal = document.getElementById('cartModal');
        
        if (this.isCartOpen) {
            cartModal.style.display = 'block';
            this.updateCartDisplay();
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    createCartModal() {
        // Cart modal HTML create करें
        const cartModalHTML = `
            <div id="cartModal" class="cart-modal" style="display: none;">
                <div class="cart-modal-overlay" onclick="shoppingCart.toggleCart()"></div>
                <div class="cart-modal-content">
                    <div class="cart-header">
                        <h2>Your Cart</h2>
                        <button class="cart-close-btn" onclick="shoppingCart.toggleCart()">&times;</button>
                    </div>
                    <div class="cart-body" id="cartItems">
                        <!-- Cart items will be inserted here -->
                    </div>
                    <div class="cart-footer">
                        <div class="cart-total">
                            <strong>Total: ₹<span id="cartTotal">0</span></strong>
                        </div>
                        <button class="checkout-btn" onclick="checkout()">Checkout</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add to body
        document.body.insertAdjacentHTML('beforeend', cartModalHTML);
        
        // Add CSS
        const cartCSS = `
            <style>
                .cart-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 9999;
                }
                
                .cart-modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                }
                
                .cart-modal-content {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 400px;
                    height: 100%;
                    background: white;
                    transform: translateX(0);
                    transition: transform 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }
                
                .cart-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                }
                
                .cart-close-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                }
                
                .cart-body {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                }
                
                .cart-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 0;
                    border-bottom: 1px solid #eee;
                }
                
                .cart-item-info {
                    flex: 1;
                }
                
                .cart-item-controls {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .cart-footer {
                    padding: 20px;
                    border-top: 1px solid #eee;
                }
                
                .checkout-btn {
                    width: 100%;
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 10px;
                }
                
                .cart-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #28a745;
                    color: white;
                    padding: 15px;
                    border-radius: 5px;
                    z-index: 10000;
                    animation: slideIn 0.3s ease-out;
                }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @media (max-width: 768px) {
                    .cart-modal-content {
                        width: 100%;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', cartCSS);
    }
    
    updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotalElement = document.getElementById('cartTotal');
        
        if (!cartItemsContainer) return;
        
        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            cartTotalElement.textContent = '0';
            return;
        }
        
        cartItemsContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price}</p>
                </div>
                <div class="cart-item-controls">
                    <button onclick="shoppingCart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="shoppingCart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <button onclick="shoppingCart.removeFromCart('${item.id}')" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; margin-left: 10px;">Remove</button>
                </div>
            </div>
        `).join('');
        
        cartTotalElement.textContent = this.getCartTotal();
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// ========== QUANTITY FUNCTIONS ==========
function increaseQty() {
    const quantityInput = document.getElementById('quantity');
    if (!quantityInput) return;
    
    let currentValue = parseInt(quantityInput.value) || 1;
    const maxValue = parseInt(quantityInput.max) || 10;
    
    if (currentValue < maxValue) {
        quantityInput.value = currentValue + 1;
    }
}

function decreaseQty() {
    const quantityInput = document.getElementById('quantity');
    if (!quantityInput) return;
    
    let currentValue = parseInt(quantityInput.value) || 1;
    const minValue = parseInt(quantityInput.min) || 1;
    
    if (currentValue > minValue) {
        quantityInput.value = currentValue - 1;
    }
}

// ========== IMAGE GALLERY FUNCTIONS ==========
function changeImage(clickedImg) {
    const mainImage = document.getElementById('mainImage');
    if (!mainImage) return;
    
    mainImage.src = clickedImg.src;
    mainImage.alt = clickedImg.alt;
    
    // Active class management
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    clickedImg.classList.add('active');
}

// ========== CHECKOUT FUNCTION ==========
function checkout() {
    alert('Redirecting to checkout...');
}

// ========== INITIALIZE EVERYTHING ==========
const shoppingCart = new ShoppingCart();

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing cart...'); // Debug
    
    // Add to cart button
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add to cart clicked'); // Debug
            
            const product = {
                id: 'earbuds-1',
                name: 'Wireless Bluetooth Earbuds',
                price: 1299,
                image: 'specker2.png'
            };
            
            shoppingCart.addToCart(product);
        });
    }
    
    // Buy now button
    const buyNowBtn = document.querySelector('.buy-now-btn');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Buy now clicked'); // Debug
            
            const product = {
                id: 'earbuds-1',
                name: 'Wireless Bluetooth Earbuds',
                price: 1299,
                image: 'specker2.png'
            };
            
            shoppingCart.addToCart(product);
            // Optional: Direct checkout
            // checkout();
        });
    }
    
    // Cart button in navigation
    const cartBtns = document.querySelectorAll('.cart-btn, [class*="cart"]');
    cartBtns.forEach(btn => {
        // Check if it's actually a cart button (has "Cart" text or cart icon)
        if (btn.textContent.toLowerCase().includes('cart') || btn.querySelector('.cart-count')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Cart button clicked'); // Debug
                shoppingCart.toggleCart();
            });
        }
    });
});




