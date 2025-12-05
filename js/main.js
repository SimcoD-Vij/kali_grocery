class KaliProvisions {
    constructor() {
        // Safely check if products exist
        if (typeof products !== 'undefined') {
            this.products = products; 
        } else {
            this.products = [];
            console.error("Products data not loaded!");
        }
        this.currentProducts = [];
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupNavigation();
        this.setupSearch();
        this.loadFeaturedProducts();
        this.setupProductsPage();
        this.setupFAQPage();
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const nav = document.querySelector('nav');
        
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                nav.classList.toggle('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });
        }
    }

    setupNavigation() {
        const currentPage = window.location.pathname.split('/').pop();
        document.querySelectorAll('nav a').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    setupSearch() {
        // Global search in header
        const searchInput = document.getElementById('globalSearch') || document.querySelector('.search-bar input');
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const searchTerm = searchInput.value.trim();
                    if (searchTerm) {
                        // Redirect to products page with search query
                        window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
                    }
                }
            });
        }
    }

    loadFeaturedProducts() {
        const featuredContainer = document.getElementById('featuredProducts');
        if (!featuredContainer || this.products.length === 0) return;
        
        featuredContainer.innerHTML = '';
        // Show first 4 products as featured
        const featuredProducts = this.products.slice(0, 4);
        
        featuredProducts.forEach(product => {
            const productCard = this.createProductCard(product);
            featuredContainer.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Default icons if image is missing
        const icons = {
            'rice': 'fas fa-seedling',
            'oil': 'fas fa-oil-can',
            'toothpaste': 'fas fa-tooth',
            'biscuit': 'fas fa-cookie-bite',
            'snacks': 'fas fa-cookie',
            'soap': 'fas fa-soap',
            'beverages': 'fas fa-coffee',
            'personal-care': 'fas fa-pump-soap',
            'vv-gold': 'fas fa-crown',
            'other': 'fas fa-shopping-basket'
        };
        
        const icon = icons[product.category] || 'fas fa-shopping-basket';
        
        // Check if image is a URL or local path
        const hasImage = product.image && product.image !== "";
        
        productCard.innerHTML = `
            <div class="product-img-container">
                <div class="product-img">
                    ${hasImage ? `<img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.parentElement.innerHTML='<i class=\\'${icon}\\'></i>'">` : `<i class="${icon}" style="font-size: 3rem; color: #ccc;"></i>`}
                    ${product.category === 'vv-gold' ? '<div class="vv-gold-badge">VV Gold</div>' : ''}
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                ${product.weight ? `<div class="product-weight" style="color: #666; font-size: 0.9em; margin-bottom: 5px;">${product.weight}</div>` : ''}
                <div class="product-rating">
                    ${this.generateStarRating(product.rating || 4.0)}
                    <span>(${product.rating || 4.0})</span>
                </div>
                <p class="product-desc">${product.description || ''}</p>
                <div class="product-actions">
                    <a href="https://wa.me/919840416695?text=Hi,%20I%20would%20like%20to%20order%20${encodeURIComponent(product.name + (product.weight ? ' - ' + product.weight : ''))}" 
                       class="whatsapp-btn" target="_blank">
                        <i class="fab fa-whatsapp"></i> Order
                    </a>
                </div>
            </div>
        `;
        
        return productCard;
    }

    setupProductsPage() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return; // Exit if not on products page
        
        // Initial Display
        this.displayProducts(this.products);
        
        // Setup Filters
        const searchInput = document.getElementById('productSearch');
        const categorySelect = document.getElementById('categorySelect');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterProducts());
        }
        
        if (categorySelect) {
            categorySelect.addEventListener('change', () => this.filterProducts());
        }
        
        // Check URL for search params (e.g. coming from Home page)
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        const categoryParam = urlParams.get('category');
        
        if (searchParam && searchInput) {
            searchInput.value = searchParam;
            this.filterProducts();
        }
        
        if (categoryParam && categorySelect) {
            categorySelect.value = categoryParam;
            this.filterProducts();
        }
    }

    filterProducts() {
        const searchInput = document.getElementById('productSearch');
        const categorySelect = document.getElementById('categorySelect');
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const category = categorySelect ? categorySelect.value : 'all';
        
        const filteredProducts = this.products.filter(product => {
            const matchesSearch = (product.name && product.name.toLowerCase().includes(searchTerm)) || 
                                  (product.description && product.description.toLowerCase().includes(searchTerm));
            const matchesCategory = category === 'all' || product.category === category;
            
            return matchesSearch && matchesCategory;
        });
        
        this.displayProducts(filteredProducts);
    }

    displayProducts(productsToShow) {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;
        
        productsGrid.innerHTML = '';
        
        if (productsToShow.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 40px; color: white;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }
        
        productsToShow.forEach(product => {
            const productCard = this.createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }

    setupFAQPage() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;
                this.classList.toggle('active');
                answer.classList.toggle('active');
            });
        });
    }

    generateStarRating(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star" style="color: #FFD700;"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt" style="color: #FFD700;"></i>';
        }
        return stars;
    }
}

// Initialize the class when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.kaliProvisions = new KaliProvisions();
});