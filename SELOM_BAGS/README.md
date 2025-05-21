# Bagstore.io - Site E-commerce Full Stack

## Vue d'ensemble
Bagstore.io est une plateforme e-commerce moderne pour la vente de sacs de luxe, intégrant un frontend JavaScript dynamique avec un backend C# .NET robuste.

## 📋 Table des Matières
- [Architecture Intégrée](#architecture-intégrée)
- [Composants Clés](#composants-clés)
- [Installation](#installation)
- [Développement](#développement)
- [Déploiement](#déploiement)

## Architecture Intégrée

### Stack Technique
- **Frontend** : JavaScript ES6+, HTML5/CSS3
- **Backend** : C# .NET 6, Entity Framework Core
- **Base de données** : SQL Server
- **Authentication** : JWT avec stockage sécurisé

### Structure du Projet
```
Bagstore.io/
├── Frontend/
│   ├── assets/          # Ressources statiques
│   ├── css/            # Styles et animations
│   ├── js/             # Logique client
│   └── components/     # Composants réutilisables
└── Backend/
    ├── Bagstore.Core/           # Logique métier
    ├── Bagstore.Infrastructure/ # Accès données
    └── Bagstore.API/           # API RESTful
```

## Composants Clés

### 1. Système de Panier Intégré
```javascript
// Frontend (cart.js)
class Cart {
    async addItem(product, quantity) {
        // Vérification stock en temps réel
        const stockStatus = await this.checkStock(product.id, quantity);
        if (!stockStatus.available) {
            throw new Error('Stock insuffisant');
        }

        // Ajout local
        this.items.push({
            id: product.id,
            quantity,
            price: product.price
        });

        // Synchronisation backend
        await this.syncWithServer();
    }
}

// Backend (CartController.cs)
public class CartController : ControllerBase {
    [HttpPost("sync")]
    public async Task<IActionResult> SyncCart([FromBody] CartData cartData) {
        var userId = User.GetUserId();
        await _cartService.UpdateUserCart(userId, cartData);
        return Ok();
    }
}
```

### 2. Gestion des Produits
```csharp
// Backend (ProductService.cs)
public class ProductService {
    public async Task<Product> CreateProduct(ProductDto dto) {
        var product = new Product {
            Name = dto.Name,
            Price = dto.Price,
            Stock = dto.Stock,
            Category = await _categoryRepo.GetById(dto.CategoryId)
        };

        await _productRepo.Add(product);
        return product;
    }
}

// Frontend (products.js)
class ProductManager {
    async displayProducts(category) {
        const products = await this.fetchProducts(category);
        this.renderProductGrid(products);
        this.initializeFilters();
        this.setupPagination();
    }
}
```

### 3. Processus de Commande
```javascript
// Frontend (checkout.js)
class CheckoutProcess {
    async processOrder(cartItems) {
        try {
            // 1. Validation finale du panier
            await this.validateCart(cartItems);

            // 2. Création de la commande
            const order = await this.createOrder(cartItems);

            // 3. Traitement du paiement
            const paymentResult = await this.processPayment(order);

            // 4. Confirmation
            await this.confirmOrder(order.id, paymentResult);

            return { success: true, orderId: order.id };
        } catch (error) {
            ErrorHandler.handle(error);
            return { success: false, error };
        }
    }
}

// Backend (OrderController.cs)
public class OrderController {
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(OrderRequest request) {
        var order = await _orderService.CreateOrder(request);
        await _stockService.UpdateStock(order);
        return Ok(order);
    }
}
```

## Installation

### Prérequis
- Node.js et npm
- .NET 6 SDK
- SQL Server
- Git

### Étapes d'Installation

1. **Configuration Initiale**
```bash
# Cloner le projet
git clone https://github.com/votre-repo/bagstore.io.git
cd bagstore.io

# Installation des dépendances frontend
cd Frontend
npm install

# Restauration des packages backend
cd ../Backend
dotnet restore
```

2. **Configuration Base de Données**
```bash
# Migration de la base de données
cd Bagstore.API
dotnet ef database update
```

3. **Variables d'Environnement**
```env
# Frontend (.env)
API_URL=http://localhost:5000
STRIPE_KEY=votre_clé_stripe

# Backend (appsettings.json)
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=Bagstore;..."
  }
}
```

## Développement

### Workflow de Développement

1. **Lancement en Développement**
```bash
# Terminal 1 - Frontend
cd Frontend
npm run dev

# Terminal 2 - Backend
cd Backend/Bagstore.API
dotnet watch run
```

2. **Tests**
```bash
# Tests Frontend
npm test

# Tests Backend
dotnet test
```

### Bonnes Pratiques

1. **Gestion des Erreurs**
```javascript
// Frontend
class ErrorHandler {
    static handle(error) {
        if (error.status === 401) {
            AuthService.refreshToken();
        } else {
            NotificationService.show(error.message);
        }
    }
}

// Backend
public class ErrorHandlingMiddleware {
    public async Task InvokeAsync(HttpContext context) {
        try {
            await _next(context);
        } catch (Exception ex) {
            await HandleException(context, ex);
        }
    }
}
```

2. **Validation**
```csharp
// Backend
public class ProductValidator : AbstractValidator<Product> {
    public ProductValidator() {
        RuleFor(x => x.Name).NotEmpty();
        RuleFor(x => x.Price).GreaterThan(0);
        RuleFor(x => x.Stock).GreaterThanOrEqualTo(0);
    }
}
```

## Déploiement

### Production

1. **Build**
```bash
# Frontend
cd Frontend
npm run build

# Backend
cd Backend
dotnet publish -c Release
```

2. **Configuration Production**
```json
{
    "Logging": {
        "LogLevel": {
            "Default": "Information"
        }
    },
    "AllowedHosts": "bagstore.io",
    "ConnectionStrings": {
        "DefaultConnection": "Server=prod;Database=bagstore;..."
    }
}
```

### Sécurité
- HTTPS forcé
- Protection CSRF
- Rate limiting
- Validation des entrées
- Sanitization des données

### Performance
- Mise en cache
- Compression des assets
- Lazy loading des images
- Minification du code
- CDN pour les ressources statiques 