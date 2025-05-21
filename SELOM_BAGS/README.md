# Bagstore.io - Site E-commerce Full Stack

## Vue d'ensemble
Bagstore.io est une plateforme e-commerce moderne pour la vente de sacs de luxe, intégrant un frontend JavaScript dynamique avec un backend C# .NET robuste. Le projet utilise une architecture propre et des pratiques de développement modernes pour offrir une expérience utilisateur optimale.

### Caractéristiques Principales
- Interface utilisateur réactive et moderne
- Gestion complète du catalogue de produits
- Système de panier d'achat en temps réel
- Gestion des commandes et du stock
- Authentification et autorisation sécurisées
- Interface d'administration complète
- Système de recherche et filtrage avancé
- Gestion des promotions et réductions
- Système de notation et avis clients
- Tableau de bord analytique

## 📋 Table des Matières
- [Architecture Intégrée](#architecture-intégrée)
- [Stack Technique](#stack-technique)
- [Structure du Projet](#structure-du-projet)
- [Base de Données](#base-de-données)
- [Composants Clés](#composants-clés)
- [Installation et Configuration](#installation-et-configuration)
- [Développement](#développement)
- [API Documentation](#api-documentation)
- [Tests](#tests)
- [Sécurité](#sécurité)
- [Déploiement](#déploiement)
- [Maintenance](#maintenance)
- [Contribution](#contribution)
- [License](#license)

## Architecture Intégrée

### Stack Technique Détaillée
#### Frontend
- **JavaScript ES6+** 
  - Promises et Async/Await pour les opérations asynchrones
  - Modules ES6 pour une meilleure organisation du code
  - Classes ES6 pour la programmation orientée objet
- **HTML5**
  - Semantic markup
  - Web Storage API
  - History API pour le routing côté client
- **CSS3**
  - Flexbox et Grid pour les layouts
  - Variables CSS pour la thématisation
  - Animations et transitions
  - Media Queries pour le responsive design
- **Outils de Build**
  - Webpack pour le bundling
  - Babel pour la transpilation
  - PostCSS pour le processing CSS
  - ESLint pour le linting

#### Backend
- **C# .NET 8.0**
  - ASP.NET Core pour l'API Web
  - Entity Framework Core 9.0 pour l'ORM
  - LINQ pour les requêtes
  - Async/Await pour la programmation asynchrone
- **Entity Framework Core**
  - Code First Approach
  - Migrations automatisées
  - Lazy Loading
  - Query Tracking
- **Patterns de Conception**
  - Repository Pattern
  - Unit of Work
  - Factory Pattern
  - Dependency Injection
  - CQRS pour certaines opérations complexes

#### Base de Données
- **SQLite**
  - Stockage fichier unique
  - Transactions ACID
  - Indexes optimisés
  - Full-text search
- **Migrations**
  - Versioning de la base de données
  - Scripts de rollback
  - Seed data
  
#### Sécurité
- **JWT (JSON Web Tokens)**
  - Tokens d'accès et de rafraîchissement
  - Validation des signatures
  - Gestion de l'expiration
- **Hachage des Mots de Passe**
  - Algorithme BCrypt
  - Salt unique par utilisateur
- **CORS**
  - Configuration par environnement
  - Whitelist des origines
- **Protection contre les attaques**
  - XSS Prevention
  - CSRF Protection
  - SQL Injection Prevention
  - Rate Limiting

### Structure du Projet Détaillée
```
Bagstore.io/
├── Frontend/
│   ├── assets/                 # Ressources statiques
│   │   ├── images/            # Images et icônes
│   │   ├── fonts/            # Polices personnalisées
│   │   └── vectors/          # SVG et autres vecteurs
│   ├── css/                  # Styles et animations
│   │   ├── base/            # Styles de base
│   │   ├── components/      # Styles des composants
│   │   ├── layouts/         # Styles des layouts
│   │   └── themes/          # Thèmes et variables
│   ├── js/                  # Logique client
│   │   ├── api/            # Services API
│   │   │   ├── products.js # API produits
│   │   │   ├── orders.js   # API commandes
│   │   │   └── users.js    # API utilisateurs
│   │   ├── components/     # Composants JS
│   │   ├── utils/         # Utilitaires
│   │   └── store/         # État global
│   └── components/         # Composants réutilisables
│       ├── cart/          # Composants panier
│       ├── product/       # Composants produit
│       └── user/          # Composants utilisateur
└── Backend/
    ├── Bagstore.Core/           # Logique métier
    │   ├── Models/             # Entités du domaine
    │   │   ├── Products/      # Modèles produits
    │   │   ├── Orders/        # Modèles commandes
    │   │   └── Users/         # Modèles utilisateurs
    │   ├── Interfaces/        # Contrats des services
    │   ├── Services/          # Services métier
    │   ├── Events/           # Événements domaine
    │   └── Exceptions/       # Exceptions personnalisées
    ├── Bagstore.Infrastructure/ # Accès données
    │   ├── Data/              # Contexte EF Core
    │   │   ├── Configurations/  # Config. des entités
    │   │   ├── Migrations/     # Migrations DB
    │   │   └── Repositories/   # Implémentation repos
    │   ├── Services/          # Services externes
    │   └── Logging/          # Configuration logs
    └── Bagstore.API/           # API RESTful
        ├── Controllers/       # Endpoints API
        ├── Middleware/       # Middleware personnalisé
        ├── Filters/         # Filtres d'action
        ├── DTOs/            # Objets de transfert
        └── Mappings/        # Profils AutoMapper
```

## Composants Clés

### 1. Système de Gestion des Produits
```csharp
// Models/Products/Product.cs
public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string Category { get; set; }
    public bool IsAvailable { get; set; }
    public string[] Colors { get; set; }
    public string[] Sizes { get; set; }
    public string ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    public virtual ICollection<OrderItem> OrderItems { get; set; }
    public virtual ICollection<Review> Reviews { get; set; }
    public virtual Category Category { get; set; }
}

// Repositories/ProductRepository.cs
public class ProductRepository : IProductRepository
{
    private readonly BagstoreContext _context;
    
    public async Task<IEnumerable<Product>> GetByCategoryAsync(string category)
    {
        return await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Reviews)
            .Where(p => p.Category.Name == category)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }
    
    public async Task<bool> UpdateStockAsync(Guid id, int quantity)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return false;
        
        product.StockQuantity = quantity;
        product.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }
}
```

### 2. Système de Commandes
```csharp
// Models/Orders/Order.cs
public class Order
{
    public Guid Id { get; set; }
    public string UserId { get; set; }
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; }
    public DateTime OrderDate { get; set; }
    
    public virtual User User { get; set; }
    public virtual ICollection<OrderItem> Items { get; set; }
    public virtual ShippingAddress ShippingAddress { get; set; }
    public virtual PaymentInfo PaymentInfo { get; set; }
}

// Services/OrderService.cs
public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;
    
    public async Task<Order> CreateOrderAsync(OrderDto orderDto)
    {
        // Validation du stock
        foreach (var item in orderDto.Items)
        {
            var product = await _productRepository.GetByIdAsync(item.ProductId);
            if (product.StockQuantity < item.Quantity)
                throw new InsufficientStockException(product.Id);
        }
        
        // Création de la commande
        var order = new Order
        {
            UserId = orderDto.UserId,
            Status = OrderStatus.Pending,
            OrderDate = DateTime.UtcNow,
            Items = orderDto.Items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                Quantity = i.Quantity,
                UnitPrice = i.Price
            }).ToList()
        };
        
        // Calcul du total
        order.TotalAmount = order.Items.Sum(i => i.Quantity * i.UnitPrice);
        
        // Sauvegarde et mise à jour du stock
        await using var transaction = await _orderRepository.BeginTransactionAsync();
        try
        {
            await _orderRepository.AddAsync(order);
            foreach (var item in order.Items)
            {
                await _productRepository.DecrementStockAsync(
                    item.ProductId, 
                    item.Quantity);
            }
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
        
        return order;
    }
}
```

### 3. Système d'Authentification
```csharp
// Services/AuthService.cs
public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    
    public async Task<AuthResult> LoginAsync(string email, string password)
    {
        var user = await _userRepository.GetByEmailAsync(email);
        if (user == null)
            throw new InvalidCredentialsException();
            
        if (!_passwordHasher.Verify(password, user.PasswordHash))
            throw new InvalidCredentialsException();
            
        var token = _jwtTokenGenerator.GenerateToken(user);
        var refreshToken = _jwtTokenGenerator.GenerateRefreshToken();
        
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _userRepository.UpdateAsync(user);
        
        return new AuthResult
        {
            Token = token,
            RefreshToken = refreshToken,
            User = user.ToDto()
        };
    }
}

// Middleware/JwtMiddleware.cs
public class JwtMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;
    
    public async Task InvokeAsync(HttpContext context)
    {
        var token = context.Request.Headers["Authorization"]
            .FirstOrDefault()?.Split(" ").Last();
            
        if (token != null)
            AttachUserToContext(context, token);
            
        await _next(context);
    }
    
    private void AttachUserToContext(HttpContext context, string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(
                _configuration["Jwt:Secret"]);
                
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidAudience = _configuration["Jwt:Audience"],
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);
            
            var jwtToken = (JwtSecurityToken)validatedToken;
            var userId = jwtToken.Claims.First(
                x => x.Type == "id").Value;
                
            context.Items["User"] = userId;
        }
        catch
        {
            // Token invalide - ne pas attacher l'utilisateur
        }
    }
}
```

## Base de Données

### Structure de la Base de Données
```sql
-- Tables Principales
CREATE TABLE Users (
    Id TEXT PRIMARY KEY,
    Email TEXT NOT NULL UNIQUE,
    PasswordHash TEXT NOT NULL,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    PhoneNumber TEXT NOT NULL,
    WishlistItems TEXT NOT NULL,  -- Stocké en JSON
    CreatedAt TEXT NOT NULL,      -- DateTime en ISO format
    LastLogin TEXT NOT NULL,      -- DateTime en ISO format
    IsActive INTEGER NOT NULL,    -- Boolean (0/1)
    Role TEXT NOT NULL
);

CREATE TABLE Products (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Description TEXT NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    ImageUrl TEXT NOT NULL,
    Category TEXT NOT NULL,
    IsAvailable INTEGER NOT NULL, -- Boolean (0/1)
    StockQuantity INTEGER NOT NULL,
    Colors TEXT NOT NULL,         -- Array stocké en JSON
    Sizes TEXT NOT NULL,         -- Array stocké en JSON
    CreatedAt TEXT NOT NULL,     -- DateTime en ISO format
    UpdatedAt TEXT NOT NULL      -- DateTime en ISO format
);

CREATE TABLE Orders (
    Id TEXT PRIMARY KEY,
    UserId TEXT NOT NULL,
    TotalAmount DECIMAL(18,2) NOT NULL,
    Status TEXT NOT NULL,
    OrderDate TEXT NOT NULL,     -- DateTime en ISO format
    ShippingAddress_FullName TEXT NOT NULL,
    ShippingAddress_Street TEXT NOT NULL,
    ShippingAddress_City TEXT NOT NULL,
    ShippingAddress_PostalCode TEXT NOT NULL,
    ShippingAddress_Country TEXT NOT NULL,
    ShippingAddress_Phone TEXT NOT NULL,
    PaymentInfo_PaymentMethod TEXT NOT NULL,
    PaymentInfo_TransactionId TEXT NOT NULL,
    PaymentInfo_Status TEXT NOT NULL,
    FOREIGN KEY(UserId) REFERENCES Users(Id)
);

-- Tables de Relations
CREATE TABLE OrderItems (
    OrderId TEXT NOT NULL,
    ProductId TEXT NOT NULL,
    Quantity INTEGER NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    PRIMARY KEY(OrderId, ProductId),
    FOREIGN KEY(OrderId) REFERENCES Orders(Id),
    FOREIGN KEY(ProductId) REFERENCES Products(Id)
);

-- Index pour les Performances
CREATE INDEX idx_products_name ON Products(Name);
CREATE INDEX idx_products_category ON Products(Category);
CREATE INDEX idx_orders_date ON Orders(OrderDate);
CREATE UNIQUE INDEX idx_users_email ON Users(Email);
```

### Requêtes Courantes
```sql
-- Recherche de produits avec filtres
SELECT p.*, COUNT(r.Id) as ReviewCount, AVG(r.Rating) as AvgRating
FROM Products p
LEFT JOIN Reviews r ON p.Id = r.ProductId
WHERE p.Category = @category
  AND p.Price BETWEEN @minPrice AND @maxPrice
  AND p.IsAvailable = 1
GROUP BY p.Id
HAVING AvgRating >= @minRating
ORDER BY p.CreatedAt DESC
LIMIT @pageSize OFFSET @offset;

-- Historique des commandes d'un utilisateur
SELECT o.*, oi.*, p.Name as ProductName
FROM Orders o
JOIN OrderItems oi ON o.Id = oi.OrderId
JOIN Products p ON oi.ProductId = p.Id
WHERE o.UserId = @userId
ORDER BY o.OrderDate DESC;

-- Mise à jour du stock après une commande
UPDATE Products
SET StockQuantity = StockQuantity - @quantity,
    UpdatedAt = @now
WHERE Id = @productId
  AND StockQuantity >= @quantity;
```

## Installation et Configuration

### Prérequis Détaillés
1. **Node.js et npm**
   - Version Node.js >= 14.x
   - npm >= 6.x
   ```bash
   # Vérification des versions
   node --version
   npm --version
   ```

2. **.NET SDK**
   - .NET 8.0 SDK
   - Entity Framework Core Tools
   ```bash
   # Installation des outils EF Core
   dotnet tool install --global dotnet-ef
   ```

3. **Outils de Développement**
   - Visual Studio Code ou Visual Studio 2022
   - Extensions recommandées :
     * C# Dev Kit
     * SQLite
     * Thunder Client (tests API)

### Installation Pas à Pas

1. **Clonage du Projet**
```bash
# Cloner le dépôt
git clone https://github.com/MaximeKELI/BAGSTORE.git
cd BAGSTORE

# Créer les branches de développement
git checkout -b develop
git checkout -b feature/your-feature develop
```

2. **Configuration Frontend**
```bash
# Installation des dépendances
cd Frontend
npm install

# Configuration des variables d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres
```

3. **Configuration Backend**
```bash
# Restauration des packages
cd Backend
dotnet restore

# Installation des packages nécessaires
cd Bagstore.API
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
```

4. **Configuration Base de Données**
```bash
# Depuis le dossier Backend/Bagstore.Infrastructure
dotnet ef migrations add InitialCreate --startup-project ../Bagstore.API
dotnet ef database update --startup-project ../Bagstore.API

# Vérification de la base de données
sqlite3 ../Bagstore.API/BagstoreDB.db
.tables
.exit
```

### Configuration Détaillée

1. **Configuration API (appsettings.json)**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=BagstoreDB.db"
  },
  "Jwt": {
    "Secret": "votre_clé_secrète_très_longue_et_complexe",
    "Issuer": "bagstore.api",
    "Audience": "bagstore.client",
    "ExpiryInMinutes": 60
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://votre-domaine.com"
    ]
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "AllowedHosts": "*",
  "FileStorage": {
    "ImagesPath": "wwwroot/images/products",
    "MaxFileSize": 5242880
  }
}
```

2. **Configuration Frontend (.env)**
```env
# API Configuration
VITE_API_BASE_URL=https://localhost:5001/api
VITE_API_TIMEOUT=5000

# Authentication
VITE_AUTH_STORAGE_KEY=bagstore_auth
VITE_TOKEN_REFRESH_INTERVAL=300000

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true

# UI Configuration
VITE_ITEMS_PER_PAGE=12
VITE_MAX_PRICE_FILTER=10000
VITE_ENABLE_DARK_MODE=true
```

## Développement

### Scripts de Développement

1. **Frontend**
```bash
# Développement avec hot-reload
npm run dev

# Build production
npm run build

# Linting et formatage
npm run lint
npm run format

# Tests
npm run test
npm run test:coverage
```

2. **Backend**
```bash
# Lancement en développement
cd Backend/Bagstore.API
dotnet watch run

# Tests
cd ../Tests
dotnet test

# Publication
cd ../Bagstore.API
dotnet publish -c Release
```

### Workflow de Développement

1. **Création d'une Nouvelle Fonctionnalité**
```bash
# Créer une nouvelle branche
git checkout -b feature/nouvelle-fonctionnalite develop

# Développement et commits
git add .
git commit -m "feat: description de la fonctionnalité"

# Mise à jour avec develop
git fetch origin develop
git rebase origin/develop

# Push et création de la PR
git push origin feature/nouvelle-fonctionnalite
```

2. **Mise à Jour de la Base de Données**
```bash
# Créer une nouvelle migration
dotnet ef migrations add NomDeLaMigration --startup-project ../Bagstore.API

# Appliquer la migration
dotnet ef database update --startup-project ../Bagstore.API

# En cas de problème, retour arrière
dotnet ef migrations remove --startup-project ../Bagstore.API
```

### Tests et Qualité du Code

1. **Tests Unitaires**
```csharp
// Tests/ProductServiceTests.cs
public class ProductServiceTests
{
    private readonly IProductService _productService;
    private readonly Mock<IProductRepository> _mockRepo;
    
    [Fact]
    public async Task GetProductById_ReturnsProduct_WhenProductExists()
    {
        // Arrange
        var productId = Guid.NewGuid();
        var product = new Product { Id = productId, Name = "Test" };
        _mockRepo.Setup(repo => repo.GetByIdAsync(productId))
                .ReturnsAsync(product);
        
        // Act
        var result = await _productService.GetProductByIdAsync(productId);
        
        // Assert
        Assert.NotNull(result);
        Assert.Equal(productId, result.Id);
    }
}
```

2. **Tests d'Intégration**
```csharp
// Tests/Integration/ProductControllerTests.cs
public class ProductControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    
    [Fact]
    public async Task GetProducts_ReturnsSuccessStatusCode()
    {
        // Arrange
        var response = await _client.GetAsync("/api/products");
        
        // Assert
        response.EnsureSuccessStatusCode();
        var products = await response.Content
            .ReadFromJsonAsync<List<ProductDto>>();
        Assert.NotNull(products);
    }
}
```

### Logging et Monitoring

1. **Configuration Serilog**
```csharp
// Program.cs
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/bagstore-.log", 
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 7)
    .CreateLogger();
```

2. **Middleware de Logging**
```csharp
// Middleware/RequestLoggingMiddleware.cs
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger _logger;
    
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        finally
        {
            _logger.LogInformation(
                "Request {method} {url} => {statusCode}",
                context.Request?.Method,
                context.Request?.Path.Value,
                context.Response?.StatusCode);
        }
    }
}
```

## Déploiement

### Préparation au Déploiement

1. **Build Frontend**
```bash
# Installation des dépendances
npm ci

# Build production
npm run build

# Tests
npm run test
```

2. **Build Backend**
```bash
# Restauration des packages
dotnet restore

# Tests
dotnet test

# Publication
dotnet publish -c Release
```

### Configuration Production

1. **Nginx Configuration**
```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name votre-domaine.com;

    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;

    location / {
        root /var/www/bagstore/frontend;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass https://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

2. **Systemd Service**
```ini
[Unit]
Description=Bagstore API

[Service]
WorkingDirectory=/var/www/bagstore/api
ExecStart=/usr/bin/dotnet Bagstore.API.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=bagstore-api
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false

[Install]
WantedBy=multi-user.target
```

### Scripts de Déploiement

1. **deploy.sh**
```bash
#!/bin/bash

# Variables
DEPLOY_PATH="/var/www/bagstore"
BACKUP_PATH="/var/backups/bagstore"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Backup
echo "Creating backup..."
mkdir -p "$BACKUP_PATH"
cp -r "$DEPLOY_PATH" "$BACKUP_PATH/backup_$TIMESTAMP"

# Deploy Frontend
echo "Deploying frontend..."
rm -rf "$DEPLOY_PATH/frontend/*"
cp -r dist/* "$DEPLOY_PATH/frontend/"

# Deploy Backend
echo "Deploying backend..."
systemctl stop bagstore-api
rm -rf "$DEPLOY_PATH/api/*"
cp -r publish/* "$DEPLOY_PATH/api/"
systemctl start bagstore-api

echo "Deployment completed!"
```

## Maintenance

### Backup de la Base de Données
```bash
#!/bin/bash

# Variables
DB_PATH="/var/www/bagstore/api/BagstoreDB.db"
BACKUP_DIR="/var/backups/bagstore/db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Création du répertoire de backup
mkdir -p "$BACKUP_DIR"

# Backup de la base
sqlite3 "$DB_PATH" ".backup '$BACKUP_DIR/bagstore_$TIMESTAMP.db'"

# Compression
gzip "$BACKUP_DIR/bagstore_$TIMESTAMP.db"

# Nettoyage des vieux backups (garde 7 jours)
find "$BACKUP_DIR" -name "bagstore_*.db.gz" -mtime +7 -delete
```

### Monitoring
```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "System": "Warning"
      }
    },
    "WriteTo": [
      {
        "Name": "File",
        "Args": {
          "path": "logs/bagstore-.log",
          "rollingInterval": "Day",
          "retainedFileCountLimit": 7,
          "formatter": "Serilog.Formatting.Json.JsonFormatter"
        }
      },
      {
        "Name": "Seq",
        "Args": {
          "serverUrl": "http://localhost:5341"
        }
      }
    ],
    "Enrich": ["FromLogContext", "WithMachineName", "WithThreadId"]
  }
}
```

## Contribution

### Guide de Contribution

1. **Style de Code**
   - Utiliser les conventions de nommage C#
   - Suivre les principes SOLID
   - Documenter le code avec XML Comments
   - Écrire des tests unitaires

2. **Processus de Pull Request**
   - Créer une branche depuis `develop`
   - Suivre la convention de commit conventionnel
   - Inclure des tests
   - Mettre à jour la documentation

3. **Revue de Code**
   - Vérifier la couverture des tests
   - Valider le style de code
   - Tester les fonctionnalités
   - Vérifier la documentation

## License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

### MIT License

Copyright (c) 2024 Bagstore.io

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 