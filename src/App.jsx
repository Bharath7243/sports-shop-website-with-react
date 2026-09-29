import ProductCard from "./components/ProductCard.jsx";
import "./App.css";
import products from "./data";
import { useState, useEffect } from "react";

function App() {
  // ─── State ───
  const allBrands = ["All", ...new Set(products.map((e) => e.brand))];
  const allCategories = [
    "All",
    ...new Set(products.map((e) => e.subCategory)),
  ];
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ─── Cart Logic ───
  function addToCart(product) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} added to cart!`);
  }

  function updateQuantity(productId, delta) {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId) {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // ─── Wishlist Logic ───
  function toggleWishlist(productId) {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }

  // ─── Toast ───
  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }

  // ─── Filter & Sort ───
  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesBrand =
      selectedBrand === "All" || product.brand === selectedBrand;
    const matchesCategory =
      selectedCategory === "All" || product.subCategory === selectedCategory;
    return matchesSearch && matchesBrand && matchesCategory;
  });

  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.rating - a.rating
    );
  }

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="app">
      {/* ──── Toast Notification ──── */}
      {toast && (
        <div className="toast" key={toast}>
          <span className="toast-icon">✓</span>
          {toast}
        </div>
      )}

      {/* ──── Cart Overlay ──── */}
      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
      )}

      {/* ──── Cart Drawer ──── */}
      <div className={`cart-drawer ${isCartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Your Cart ({cartCount})</h2>
          <button
            className="cart-close-btn"
            onClick={() => setIsCartOpen(false)}
          >
            ✕
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <p>Your cart is empty</p>
            <button
              className="btn-primary"
              onClick={() => setIsCartOpen(false)}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <p className="cart-item-price">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>
                    <div className="cart-item-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total-row">
                <span>Subtotal</span>
                <span className="cart-total-price">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>
              <button className="checkout-btn">Proceed to Checkout</button>
            </div>
          </>
        )}
      </div>

      {/* ──── Navigation ──── */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="/" className="logo">
            <span className="logo-icon">◆</span>
            BHARATH SPORTS
          </a>

          {/* Hamburger */}
          <button
            className={`hamburger ${mobileMenuOpen ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
            <li>
              <a
                href="#products"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </a>
            </li>
            <li>
              <a
                href="#"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Deals
              </a>
            </li>
            <li>
              <a
                href="#"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Support
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
            </li>
          </ul>

          <div className="nav-actions">
            {/* Wishlist */}
            <button className="icon-btn" aria-label="Wishlist">
              ♡
              {wishlist.length > 0 && (
                <span className="badge">{wishlist.length}</span>
              )}
            </button>

            {/* Cart */}
            <button
              className="icon-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="Cart"
            >
              🛒
              {cartCount > 0 && (
                <span className="badge">{cartCount}</span>
              )}
            </button>

            <button className="nav-btn primary" onClick={() => {
              document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
            }}>
              Shop Now
            </button>
          </div>
        </div>
      </nav>

      {/* ──── Hero Section ──── */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-tag">New Arrivals 2026</p>
          <h1 className="hero-title">
            The Future of Sports
            <br />
            <span className="hero-highlight">Is Here.</span>
          </h1>
          <p className="hero-description">
            Discover the latest in premium Sports Items. From The Place Where
            1000's of Customers have Trust.
          </p>
          <div className="hero-cta">
            <button
              className="btn-primary"
              onClick={() => {
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Products
            </button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">5K+</span>
            <span className="stat-label">Happy Customers</span>
          </div>
          <div className="stat">
            <span className="stat-number">200+</span>
            <span className="stat-label">Premium Products</span>
          </div>
          <div className="stat">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Customer Support</span>
          </div>
        </div>
      </section>

      {/* ──── Products Section ──── */}
      <section className="products-section" id="products">
        <div className="section-header">
          <h2 className="section-title">Our Products</h2>
          <p className="section-subtitle">
            Premium sports equipment loved by athletes
          </p>
        </div>

        {/* Toolbar: Search + Filters + Sort */}
        <div className="toolbar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="search-clear"
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-group">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="default">Sort by</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="results-count">
          Showing {filteredProducts.length} of {products.length} products
        </p>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((data) => (
              <ProductCard
                key={data.id}
                image={data.image}
                name={data.name}
                price={data.price}
                originalPrice={data.originalPrice}
                discount={data.discount}
                rating={data.rating}
                isBestSeller={data.isBestSeller}
                onAddToCart={() => addToCart(data)}
                isWishlisted={wishlist.includes(data.id)}
                onToggleWishlist={() => toggleWishlist(data.id)}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <span className="no-results-icon">😕</span>
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
            <button
              className="btn-primary"
              onClick={() => {
                setSearchTerm("");
                setSelectedBrand("All");
                setSelectedCategory("All");
                setSortBy("default");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* ──── Footer ──── */}
      <footer className="footer" id="about">
        <div className="footer-grid">
          <div className="footer-col footer-brand">
            <a href="/" className="footer-logo">
              <span className="logo-icon">◆</span> BHARATH SPORTS
            </a>
            <p className="footer-about">
              Your trusted destination for premium cricket and sports equipment.
              Quality gear for champions since 2020.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Shop</h4>
            <ul className="footer-links">
              <li><a href="#products">Cricket Bats</a></li>
              <li><a href="#products">Balls</a></li>
              <li><a href="#products">Shoes</a></li>
              <li><a href="#products">Protective Gear</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Shipping</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Bharath Sports. All rights reserved.</p>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Instagram">📷</a>
            <a href="#" className="social-link" aria-label="Twitter">🐦</a>
            <a href="#" className="social-link" aria-label="Facebook">📘</a>
            <a href="#" className="social-link" aria-label="YouTube">▶️</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
