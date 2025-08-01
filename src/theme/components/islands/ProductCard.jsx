import { useState } from 'react';
import styles from '../../styles/product-card.module.css';

/**
 * ProductCard Island Component
 *
 * Displays a product card with:
 * - Product images in a carousel
 * - Color variant selection
 * - Product information (name, price)
 * - Rating display
 *
 * When a color is selected, it shows the corresponding product image.
 */
function ProductCard({
  product = {},
  productImages = [],
  productVariants = [],
}) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    productVariants.length > 0 ? productVariants[0].id : null,
  );

  // Find the currently selected variant
  const selectedVariant = productVariants.find(
    (variant) => variant.id === selectedVariantId,
  );

  // Find the representative image for the selected variant
  const selectedImage = selectedVariant
    ? productImages.find(
        (image) => image.id === selectedVariant.representative_image_id,
      )
    : productImages.length > 0
    ? productImages[0]
    : null;

  // Handle color/variant selection
  const handleVariantSelect = (variantId) => {
    setSelectedVariantId(variantId);
  };

  // If no product data is provided, return empty state
  if (!product || !product.id) {
    return <div className={styles.emptyCard}>Product data not available</div>;
  }

  return (
    <div className={styles.productCardContainer}>
      {/* Product Image Carousel */}
      <div className={styles.productImageContainer}>
        {selectedImage && (
          <div className={styles.productImage}>
            <img
              src={selectedImage.url}
              alt={`${product.name} - ${
                selectedVariant ? selectedVariant.color_name : ''
              }`}
            />
          </div>
        )}
      </div>

      {/* Color/Variant Selection */}
      <div className={styles.variantSelectionContainer}>
        {productVariants.map((variant) => (
          <div
            key={variant.id}
            className={`
              ${styles.variantOption} 
              ${selectedVariantId === variant.id ? styles.selectedVariant : ''}
              ${!variant.in_stock ? styles.outOfStock : ''}
            `}
            onClick={() => variant.in_stock && handleVariantSelect(variant.id)}
          >
            {/* Show swatch image if available, otherwise color */}
            {variant.swatch_image ? (
              <img
                src={variant.swatch_image}
                alt={variant.color_name}
                className={styles.swatchImage}
              />
            ) : (
              <div
                className={styles.colorSwatch}
                style={{ backgroundColor: variant.color_value }}
                title={variant.color_name}
              />
            )}

            {/* Show "X" indicator for out-of-stock variants */}
            {!variant.in_stock && <div className={styles.outOfStockX}>✕</div>}
          </div>
        ))}
      </div>

      {/* Product Information */}
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <div className={styles.productPrice}>${product.price.toFixed(2)}</div>

        {/* Rating display */}
        <div className={styles.ratingContainer}>
          {product.rating && (
            <>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`
                      ${styles.star} 
                      ${
                        star <= Math.round(product.rating)
                          ? styles.filledStar
                          : ''
                      }
                    `}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className={styles.reviewCount}>
                ({product.review_count || 0})
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
