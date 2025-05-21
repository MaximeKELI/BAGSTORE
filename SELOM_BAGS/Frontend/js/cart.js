class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.total = this.calculateTotal();
    }

    addItem(product, quantity = 1, color = null, size = null) {
        const existingItem = this.items.find(item => 
            item.id === product.id && 
            item.color === color && 
            item.size === size
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.imageUrl,
                quantity,
                color,
                size
            });
        }

        this.save();
        this.updateUI();
    }

    removeItem(itemId, color, size) {
        this.items = this.items.filter(item => 
            !(item.id === itemId && item.color === color && item.size === size)
        );
        this.save();
        this.updateUI();
    }

    updateQuantity(itemId, color, size, quantity) {
        const item = this.items.find(item => 
            item.id === itemId && 
            item.color === color && 
            item.size === size
        );
        
        if (item) {
            item.quantity = quantity;
            this.save();
            this.updateUI();
        }
    }

    clear() {
        this.items = [];
        this.save();
        this.updateUI();
    }

    calculateTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.total = this.calculateTotal();
    }

    updateUI() {
        // Update cart count
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }

        // Update cart modal if it's open
        const cartItemsList = document.getElementById('cart-items');
        if (cartItemsList) {
            cartItemsList.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>Prix: ${item.price}€</p>
                        <p>Quantité: 
                            <button onclick="cart.updateQuantity('${item.id}', '${item.color}', '${item.size}', ${item.quantity - 1})">-</button>
                            ${item.quantity}
                            <button onclick="cart.updateQuantity('${item.id}', '${item.color}', '${item.size}', ${item.quantity + 1})">+</button>
                        </p>
                        ${item.color ? `<p>Couleur: ${item.color}</p>` : ''}
                        ${item.size ? `<p>Taille: ${item.size}</p>` : ''}
                    </div>
                    <button onclick="cart.removeItem('${item.id}', '${item.color}', '${item.size}')" class="remove-item">
                        Supprimer
                    </button>
                </div>
            `).join('');

            const cartTotal = document.getElementById('cart-total');
            if (cartTotal) {
                cartTotal.textContent = `Total: ${this.total}€`;
            }
        }
    }

    getOrderData() {
        return {
            items: this.items.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                color: item.color,
                size: item.size,
                unitPrice: item.price
            })),
            totalAmount: this.total
        };
    }
}

// Initialize cart
const cart = new Cart();
export default cart; 