import { useState, memo } from 'react';
import './ProductCard.css';

const categoryIcons = {
  laptops: '💻',
  smartphones: '📱',
  tablets: '📋',
  audio: '🎧',
  monitors: '🖥️',
  accessories: '🖱️',
  storage: '💾',
  networking: '📡',
};

const ProductCard = memo(function ProductCard({ product, index }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const margin = ((product.price - product.cost) / product.price) * 100;
  const stockStatus =
    product.stock <= product.minStock
      ? 'low'
      : product.stock <= product.minStock * 2
      ? 'medium'
      : 'good';

  return (
    <article
      className="product-card"
      id={`product-${product.id}`}
      style={{ '--anim-delay': `${index * 0.06}s` }}
    >
      {/* Image */}
      <div className="product-card__image-wrap">
        {!imgLoaded && !imgError && (
          <div className="product-card__img-skeleton" />
        )}
        {!imgError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`product-card__img ${imgLoaded ? 'product-card__img--loaded' : ''}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="product-card__img-fallback">
            {categoryIcons[product.category] || '📦'}
          </div>
        )}
        <div className="product-card__category-badge">
          <span>{categoryIcons[product.category]}</span>
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div className="product-card__body">
        <div className="product-card__brand">{product.brand}</div>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">{product.description}</p>

        {/* Tags */}
        <div className="product-card__tags">
          {product.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="product-card__tag">
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="product-card__footer">
          <div className="product-card__price-block">
            <span className="product-card__price">
              ${product.price.toLocaleString('en-US')}
            </span>
            <span className="product-card__margin">
              {margin.toFixed(0)}% margen
            </span>
          </div>
          <div className={`product-card__stock product-card__stock--${stockStatus}`}>
            <span className="product-card__stock-dot" />
            {product.stock} uds.
          </div>
        </div>

        <span className="product-card__sku">SKU: {product.sku}</span>
      </div>
  </article>
  );
});

export default ProductCard;
