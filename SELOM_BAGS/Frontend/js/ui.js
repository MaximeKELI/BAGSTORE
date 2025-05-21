import { ProductsApi } from './api.js';
import cart from './cart.js';

class UI {
    constructor() {
        this.initializeModals();
        this.initializeEventListeners();
        this.initializeAnimations();
    }

    initializeModals() {
        // Cart Modal
        const cartModalHTML = `
            <div id="cart-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Votre Panier</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div id="cart-items" class="modal-body"></div>
                    <div class="modal-footer">
                        <div id="cart-total"></div>
                        <button id="checkout-button" class="btn-primary">Procéder au paiement</button>
                    </div>
                </div>
            </div>`;

        // Quick View Modal
        const quickViewModalHTML = `
            <div id="quick-view-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Aperçu rapide</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div id="quick-view-content" class="modal-body"></div>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', cartModalHTML + quickViewModalHTML);
    }

    initializeEventListeners() {
        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', () => {
                button.closest('.modal').classList.remove('active');
            });
        });

        // Cart button
        document.getElementById('cart-button').addEventListener('click', () => {
            document.getElementById('cart-modal').classList.add('active');
            cart.updateUI();
        });

        // Quick view buttons
        document.querySelectorAll('.quick-view-button').forEach(button => {
            button.addEventListener('click', async (e) => {
                const productId = e.target.dataset.productId;
                const product = await ProductsApi.getProductById(productId);
                this.showQuickView(product);
            });
        });

        // Checkout button
        document.getElementById('checkout-button').addEventListener('click', () => {
            this.showCheckoutModal();
        });
    }

    initializeAnimations() {
        // Particle animation
        this.createParticles();
        
        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Intersection Observer for fade-in animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        });

        document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    }

    createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        document.body.appendChild(particlesContainer);

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particlesContainer.appendChild(particle);
        }
    }

    showQuickView(product) {
        const quickViewContent = document.getElementById('quick-view-content');
        quickViewContent.innerHTML = `
            <div class="product-quick-view">
                <div class="product-image">
                    <img src="${product.imageUrl}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price}€</p>
                    <p class="description">${product.description}</p>
                    <div class="color-selection">
                        ${product.colors.map(color => `
                            <button class="color-option" style="background-color: ${color}"></button>
                        `).join('')}
                    </div>
                    <div class="size-selection">
                        ${product.sizes.map(size => `
                            <button class="size-option">${size}</button>
                        `).join('')}
                    </div>
                    <div class="quantity-selection">
                        <button class="quantity-decrease">-</button>
                        <input type="number" value="1" min="1" max="10">
                        <button class="quantity-increase">+</button>
                    </div>
                    <button class="add-to-cart-button btn-primary">Ajouter au panier</button>
                </div>
            </div>`;

        document.getElementById('quick-view-modal').classList.add('active');
    }

    showCheckoutModal() {
        // Implementation du modal de checkout
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Initialize UI
const ui = new UI();
export default ui; 