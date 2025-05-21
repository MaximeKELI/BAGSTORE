// Intersection Observer pour les animations au défilement
const animateOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
}, { threshold: 0.1 });

// Appliquer l'observer aux éléments
document.querySelectorAll('.animate-on-scroll').forEach((element) => {
  animateOnScroll.observe(element);
});

// Header scroll effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > lastScroll && currentScroll > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// Smooth scroll pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Animation du panier
const cartButton = document.querySelector('.cart-button');
const cartCount = document.querySelector('.cart-count');

if (cartButton && cartCount) {
  cartButton.addEventListener('click', () => {
    cartCount.classList.add('bump');
    setTimeout(() => cartCount.classList.remove('bump'), 300);
  });
}

// Parallax effect pour le hero
const hero = document.querySelector('.hero');
if (hero) {
  window.addEventListener('scroll', () => {
    const scroll = window.pageYOffset;
    hero.style.backgroundPositionY = `${scroll * 0.5}px`;
  });
}

// Animation des produits au hover
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mouseenter', (e) => {
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    card.style.transform = `
      perspective(1000px)
      rotateX(${(y - 0.5) * 10}deg)
      rotateY(${(x - 0.5) * 10}deg)
      translateZ(20px)
    `;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'none';
  });
});

// Loader
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader-container');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }
});

// Menu mobile
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
}

// Générateur de particules dorées
class ParticleGenerator {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'particle-container';
        document.body.appendChild(this.container);
        this.particles = [];
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
        setInterval(() => this.createParticles(), 2000);
    }

    createParticles() {
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Position aléatoire
            const startX = Math.random() * window.innerWidth;
            const xEnd = (Math.random() - 0.5) * 200;
            
            particle.style.left = `${startX}px`;
            particle.style.bottom = '0';
            particle.style.setProperty('--x-end', `${xEnd}px`);
            
            // Animation
            particle.style.animation = `particleRise ${3 + Math.random() * 2}s ease-out forwards`;
            
            this.container.appendChild(particle);
            
            // Nettoyage après l'animation
            setTimeout(() => {
                particle.remove();
            }, 5000);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
    }
}

// Effet de lumière rotative sur les cartes
class CardLightEffect {
    constructor() {
        this.cards = document.querySelectorAll('.product-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            // Ajout de l'effet rotatif
            const rotatingLight = document.createElement('div');
            rotatingLight.className = 'rotating-light';
            card.appendChild(rotatingLight);

            // Ajout de l'effet de vague
            const waveLight = document.createElement('div');
            waveLight.className = 'wave-light';
            card.appendChild(waveLight);

            // Ajout de l'effet de brillance
            const shineEffect = document.createElement('div');
            shineEffect.className = 'shine-effect';
            card.appendChild(shineEffect);
        });
    }
}

// Effet de particules sur le hover des titres
class TitleSparkleEffect {
    constructor() {
        this.titles = document.querySelectorAll('.hero-title, .section-title');
        this.init();
    }

    init() {
        this.titles.forEach(title => {
            title.addEventListener('mouseover', () => {
                this.createSparkles(title);
            });
        });
    }

    createSparkles(element) {
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle-effect';
            
            // Position aléatoire autour du titre
            const x = (Math.random() - 0.5) * 200;
            const y = (Math.random() - 0.5) * 100;
            sparkle.style.setProperty('--x', `${x}px`);
            sparkle.style.setProperty('--y', `${y}px`);
            
            element.appendChild(sparkle);
            
            // Nettoyage
            setTimeout(() => sparkle.remove(), 3000);
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new ParticleGenerator();
    new CardLightEffect();
    new TitleSparkleEffect();
});

// Gestion du panier avec localStorage
const cart = {
  items: JSON.parse(localStorage.getItem('cart')) || [],
  
  addItem(product) {
    this.items.push(product);
    this.saveCart();
    this.updateCartUI();
  },
  
  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCart();
    this.updateCartUI();
  },
  
  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  },
  
  updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      cartCount.textContent = this.items.length;
    }
  }
};

// Initialiser l'UI du panier
cart.updateCartUI();

// Ajouter des produits au panier
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', (e) => {
    const productCard = e.target.closest('.product-card');
    if (productCard) {
      const product = {
        id: productCard.dataset.productId,
        name: productCard.querySelector('.product-title').textContent,
        price: productCard.querySelector('.product-price').textContent,
        image: productCard.querySelector('.product-image').src
      };
      
      cart.addItem(product);
      
      // Animation de confirmation
      const notification = document.createElement('div');
      notification.className = 'add-to-cart-notification';
      notification.textContent = 'Produit ajouté au panier';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 2000);
    }
  });
}); 