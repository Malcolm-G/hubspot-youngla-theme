import { useState, useEffect } from 'react';
import ProductCard from './ProductCard.jsx';
import styles from '../../styles/product-list.module.css';

function ProductList({
  title,
  subtitle,
  productsPerPage = 16,
  enablePagination = false,
  tableName,
  variantsTableName,
  imagesTableName,
  maxProducts = 50,
  sortBy = 'created_at',
  sortDirection = 'DESC',
}) {
  const [products, setProducts] = useState([]);
  const [productVariants, setProductVariants] = useState({});
  const [productImages, setProductImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      console.log(tableName, variantsTableName, imagesTableName);
      if (!tableName) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch products from HubDB v3 API
        const productsUrl = `https://api.hubapi.com/cms/v3/hubdb/tables/${tableName}/rows?sort=${
          sortDirection === 'DESC' ? '-' : ''
        }${sortBy}&after=${
          (currentPage - 1) * productsPerPage
        }&limit=${productsPerPage}&portalId=47574277`;
        console.log('[ProductList] Fetching products:', productsUrl);
        const productsResponse = await fetch(productsUrl);
        if (!productsResponse.ok) {
          throw new Error(
            `Failed to fetch products: ${productsResponse.status}`,
          );
        }
        const productsData = await productsResponse.json();
        console.log('[ProductList] Products response:', productsData);

        if (!productsData.results || productsData.results.length === 0) {
          console.log('[ProductList] No products found.');
          setProducts([]);
          setLoading(false);
          return;
        }

        // Calculate total pages
        setTotalPages(Math.ceil(productsData.total / productsPerPage));

        // Format products
        const formattedProducts = productsData.results.map((row) => ({
          id: row.id.toString(),
          name: row.values.name,
          price: parseFloat(row.values.price),
        }));
        console.log('[ProductList] Formatted products:', formattedProducts);

        setProducts(formattedProducts);

        // Fetch variants if variantsTableName is provided
        if (variantsTableName) {
          const productIds = formattedProducts.map((p) => p.id).join(',');
          const variantsUrl = `https://api.hubapi.com/cms/v3/hubdb/tables/${variantsTableName}/rows?product__in=${productIds}&portalId=47574277`;
          console.log('[ProductList] Fetching variants:', variantsUrl);
          const variantsResponse = await fetch(variantsUrl);
          const variantsData = await variantsResponse.json();
          console.log('[ProductList] Variants response:', variantsData);

          // Process variants by product ID
          const variants = {};
          if (variantsData.results) {
            variantsData.results.forEach((variant) => {
              // product is an array of objects with id and name
              if (Array.isArray(variant.values.product)) {
                variant.values.product.forEach((productRef) => {
                  const productId = productRef.id.toString();
                  if (!variants[productId]) variants[productId] = [];
                  variants[productId].push({
                    id: variant.id.toString(),
                    name: variant.values.name,
                    swatch_image: variant.values.swatch_image,
                    in_stock: variant.values.in_stock,
                    color: variant.values.color,
                    representative_image: variant.values.representative_image,
                  });
                });
              }
            });
          }
          console.log('[ProductList] Formatted variants:', variants);

          setProductVariants(variants);

          // Fetch images if imagesTableName is provided
          if (imagesTableName && variantsData.results) {
            const productIds = formattedProducts.map((p) => p.id).join(',');
            const imagesUrl = `https://api.hubapi.com/cms/v3/hubdb/tables/${imagesTableName}/rows?product__in=${productIds}&portalId=47574277`;
            console.log('[ProductList] Fetching images:', imagesUrl);
            const imagesResponse = await fetch(imagesUrl);
            const imagesData = await imagesResponse.json();
            console.log('[ProductList] Images response:', imagesData);

            // Process images by product ID
            const images = {};
            if (imagesData.results) {
              imagesData.results.forEach((image) => {
                // product is an array of objects with id and name
                if (Array.isArray(image.values.product)) {
                  image.values.product.forEach((productRef) => {
                    const productId = productRef.id.toString();
                    if (!images[productId]) images[productId] = [];
                    images[productId].push({
                      id: image.id.toString(),
                      name: image.values.name,
                      image: image.values.image,
                    });
                  });
                }
              });
            }
            console.log('[ProductList] Formatted images:', images);

            setProductImages(images);
          }
        }
      } catch (err) {
        console.error('Error fetching data from HubDB:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    tableName,
    variantsTableName,
    imagesTableName,
    currentPage,
    productsPerPage,
    sortBy,
    sortDirection,
  ]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  if (loading) return <div className={styles.loading}>Loading products...</div>;
  if (error) return <div className={styles.error}>Error loading products.</div>;
  if (products.length === 0)
    return <div className={styles.noProducts}>No products found.</div>;

  return (
    <div className={styles.productListContainer}>
      {/* Product Grid */}
      <div className={styles.productGrid}>
        {products.map((product) => (
          <div key={product.id} className={styles.productGridItem}>
            <ProductCard
              product={product}
              productVariants={productVariants[product.id] || []}
              productImages={productImages[product.id] || []}
            />
          </div>
        ))}
      </div>

      {/* Pagination - Only shown if enabled */}
      {enablePagination && (
        <div className={styles.productListPagination}>
          <button
            className={styles.paginationButton}
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          <div className={styles.paginationPages}>
            <span className={styles.currentPage}>{currentPage}</span> of{' '}
            <span className={styles.totalPages}>{totalPages}</span>
          </div>
          <button
            className={styles.paginationButton}
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductList;
