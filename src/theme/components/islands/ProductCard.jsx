import { useState, useCallback, useEffect } from 'react';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  console.log(productImages);

  // Find the currently selected variant
  const selectedVariant = productVariants.find(
    (variant) => variant.id === selectedVariantId,
  );
  console.log('Selected Variant:', selectedVariant);

  console.log('Product Images:', productImages);

  // Get all images for carousel - show all product images
  const carouselImages = productImages.length > 0 ? productImages : [];

  // Find the representative image for the selected variant to set as initial image
  const selectedImage = selectedVariant
    ? productImages.find(
        (image) => image.id === selectedVariant.representative_image[0].id,
      )
    : productImages.length > 0
    ? productImages[0]
    : null;

  // Set current image index when variant changes
  const updateImageIndexForVariant = (variantId) => {
    const variant = productVariants.find((v) => v.id === variantId);
    if (
      variant &&
      variant.representative_image &&
      Array.isArray(variant.representative_image) &&
      variant.representative_image[0]
    ) {
      const imageIndex = productImages.findIndex(
        (image) => image.id === variant.representative_image[0].id,
      );
      if (imageIndex !== -1) {
        setCurrentImageIndex(imageIndex);
      }
    }
  };

  console.log(productImages[0]);
  console.log('Selected Image:', selectedImage);

  // Carousel navigation functions
  const nextImage = useCallback(() => {
    if (carouselImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }
  }, [carouselImages.length]);

  const prevImage = useCallback(() => {
    if (carouselImages.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + carouselImages.length) % carouselImages.length,
      );
    }
  }, [carouselImages.length]);

  // Handle color/variant selection
  const handleVariantSelect = (variantId) => {
    setSelectedVariantId(variantId);
    updateImageIndexForVariant(variantId);
  };

  // Initialize the image index based on the first variant's representative image
  useEffect(() => {
    if (selectedVariantId) {
      updateImageIndexForVariant(selectedVariantId);
    }
  }, [productImages, productVariants, selectedVariantId]);

  // If no product data is provided, return empty state
  if (!product || !product.id) {
    return <div className={styles.emptyCard}>Product data not available</div>;
  }

  return (
    <div className={styles.productCardContainer}>
      {/* Product Image Carousel */}
      <div className={styles.productImageContainer}>
        {carouselImages.length > 0 && (
          <div className={styles.productImageCarousel}>
            <div className={styles.productImage}>
              <img
                className={styles.productImageElement}
                src={carouselImages[currentImageIndex].image.url}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
              />
            </div>

            {/* Carousel Navigation - only show if more than 1 image */}
            {carouselImages.length > 1 && (
              <>
                <button
                  className={`${styles.carouselNavButton} ${styles.carouselPrevButton}`}
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  &#10094;
                </button>
                <button
                  className={`${styles.carouselNavButton} ${styles.carouselNextButton}`}
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  &#10095;
                </button>

                {/* Image dots indicator */}
                <div className={styles.carouselDots}>
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.carouselDot} ${
                        index === currentImageIndex
                          ? styles.carouselActiveDot
                          : ''
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <div className={styles.productPrice}>${product.price.toFixed(2)}</div>
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
                style={{ backgroundColor: variant.color.name }}
                title={variant.color}
              />
            )}

            {/* Show "X" indicator for out-of-stock variants */}
            {!variant.in_stock && <div className={styles.outOfStockX}>✕</div>}
          </div>
        ))}
      </div>

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
  );
}

export default ProductCard;
