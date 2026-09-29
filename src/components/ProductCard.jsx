import "./ProductCard.css";

export default function ProductCard({
  image,
  name,
  price,
  originalPrice,
  discount,
  rating,
  isBestSeller,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) {
  return (
    <div className="product-card">
      {/* Discount Badge */}
      {discount && <span className="discount-badge">{discount}</span>}

      {/* Wishlist Button */}
      <button
        className={`wishlist-heart ${isWishlisted ? "active" : ""}`}
        onClick={onToggleWishlist}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isWishlisted ? "❤️" : "🤍"}
      </button>

      {/* Product Image */}
      <div className="image-container">
        <img src={image} alt={name} className="product-image" />
      </div>

      {/* Content */}
      <div className="card-content">
        <h3 className="product-name">{name}</h3>

        {/* Rating */}
        <div className="rating">
          <span className="stars">
            {"★".repeat(Math.floor(rating))}
            {"☆".repeat(5 - Math.floor(rating))}
          </span>
          <span className="rating-value">{rating}</span>
          {isBestSeller && <span className="bestseller-tag">Best Seller</span>}
        </div>

        {/* Price */}
        <div className="price-row">
          <span className="price">₹{price.toLocaleString("en-IN")}</span>
          {originalPrice && (
            <span className="original-price">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Button */}
        <button className="add-btn" onClick={onAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
