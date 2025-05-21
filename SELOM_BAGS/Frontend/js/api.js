// API endpoints
const API_BASE_URL = 'https://localhost:5001/api';

// Products API
const ProductsApi = {
    getAllProducts: async () => {
        const response = await fetch(`${API_BASE_URL}/products`);
        return await response.json();
    },

    getProductById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        return await response.json();
    },

    getProductsByCategory: async (category) => {
        const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
        return await response.json();
    },

    searchProducts: async (term) => {
        const response = await fetch(`${API_BASE_URL}/products/search?term=${encodeURIComponent(term)}`);
        return await response.json();
    }
};

// Orders API
const OrdersApi = {
    createOrder: async (orderData) => {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        return await response.json();
    },

    getUserOrders: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
        return await response.json();
    }
};

// Users API
const UsersApi = {
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        return await response.json();
    },

    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        return await response.json();
    },

    updateWishlist: async (userId, productId, action) => {
        const method = action === 'add' ? 'POST' : 'DELETE';
        const response = await fetch(`${API_BASE_URL}/users/${userId}/wishlist/${productId}`, {
            method
        });
        return response.ok;
    },

    getWishlist: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/wishlist`);
        return await response.json();
    }
};

export { ProductsApi, OrdersApi, UsersApi }; 