import { Island } from '@hubspot/cms-components';
import {
  ModuleFields,
  NumberField,
  BooleanField,
  FieldGroup,
  TextField,
  ChoiceField,
  LabelField,
} from '@hubspot/cms-components/fields';
import ProductCard from '../../islands/ProductCard.jsx?island';
import Layout from '../../Layout.jsx';
import styles from '../../../styles/product-list.module.css';

/**
 * This module displays a list of product cards that can be filtered by category.
 * Each product card is an Island component that provides client-side interactivity
 * for carousel functionality and color variant selection.
 */
export const Component = ({ fieldValues, hublParameters = {} }) => {
  const {
    title,
    subtitle,
    productsPerPage = 16,
    enablePagination = false,
    tableId,
    maxProducts = 50,
    sortBy = 'created_at',
    sortDirection = 'DESC',
  } = fieldValues;

  // In an actual implementation, this would fetch data from HubDB
  // For now, we'll use static sample data
  const sampleProducts = [
    {
      id: '1',
      name: 'Encore Track Pants',
      price: 52.0,
      rating: 5,
      review_count: 6,
    },
    {
      id: '2',
      name: 'Scuffed Cloud Tees',
      price: 38.0,
      rating: 5,
      review_count: 1,
    },
    {
      id: '3',
      name: 'Tree Camo Baggy Sweats',
      price: 58.0,
      rating: 5,
      review_count: 534,
    },
  ];

  const sampleVariants = {
    1: [
      {
        id: '101',
        color_name: 'Black',
        color_value: '#000000',
        in_stock: true,
        representative_image_id: '1001',
      },
      {
        id: '102',
        color_name: 'Red',
        color_value: '#FF0000',
        in_stock: true,
        representative_image_id: '1002',
      },
      {
        id: '103',
        color_name: 'Green',
        color_value: '#008000',
        in_stock: false,
        representative_image_id: '1003',
      },
      {
        id: '104',
        color_name: 'Navy',
        color_value: '#000080',
        in_stock: true,
        representative_image_id: '1004',
      },
    ],
    2: [
      {
        id: '201',
        color_name: 'Grey',
        color_value: '#808080',
        in_stock: true,
        representative_image_id: '2001',
      },
      {
        id: '202',
        color_name: 'Off-white',
        color_value: '#F5F5DC',
        in_stock: true,
        representative_image_id: '2002',
      },
    ],
    3: [
      {
        id: '301',
        color_name: 'Black Camo',
        swatch_image: 'https://example.com/black-camo.jpg',
        in_stock: true,
        representative_image_id: '3001',
      },
      {
        id: '302',
        color_name: 'Forest Camo',
        swatch_image: 'https://example.com/forest-camo.jpg',
        in_stock: true,
        representative_image_id: '3002',
      },
      {
        id: '303',
        color_name: 'Desert Camo',
        swatch_image: 'https://example.com/desert-camo.jpg',
        in_stock: true,
        representative_image_id: '3003',
      },
    ],
  };

  const sampleImages = {
    1: [
      {
        id: '1001',
        url: 'https://www.youngla.com/cdn/shop/files/2051_navy_002_07_15_rudy_ecomm.jpg?v=1751918007&width=700',
      },
      {
        id: '1002',
        url: 'https://www.youngla.com/cdn/shop/files/2051_navy_002_07_15_rudy_ecomm.jpg?v=1751918007&width=700',
      },
      {
        id: '1003',
        url: 'https://via.placeholder.com/400x500?text=Green+Track+Pants',
      },
      {
        id: '1004',
        url: 'https://via.placeholder.com/400x500?text=Navy+Track+Pants',
      },
    ],
    2: [
      { id: '2001', url: 'https://via.placeholder.com/400x500?text=Grey+Tee' },
      {
        id: '2002',
        url: 'https://via.placeholder.com/400x500?text=Off-white+Tee',
      },
    ],
    3: [
      {
        id: '3001',
        url: 'https://via.placeholder.com/400x500?text=Black+Camo+Sweats',
      },
      {
        id: '3002',
        url: 'https://via.placeholder.com/400x500?text=Forest+Camo+Sweats',
      },
      {
        id: '3003',
        url: 'https://via.placeholder.com/400x500?text=Desert+Camo+Sweats',
      },
    ],
  };

  return (
    <Layout>
      <div className={styles.productListContainer}>
        {/* Module Header */}
        {title && <h2 className={styles.productListTitle}>{title}</h2>}
        {subtitle && <p className={styles.productListSubtitle}>{subtitle}</p>}

        {/* Product Grid */}
        <div className={styles.productGrid}>
          {sampleProducts.map((product) => (
            <div key={product.id} className={styles.productGridItem}>
              <Island
                module={ProductCard}
                hydrateOn="visible"
                product={product}
                productVariants={sampleVariants[product.id] || []}
                productImages={sampleImages[product.id] || []}
              />
            </div>
          ))}
        </div>

        {/* Pagination - Only shown if enabled */}
        {enablePagination && (
          <div className={styles.productListPagination}>
            <button className={styles.paginationButton}>Previous</button>
            <div className={styles.paginationPages}>
              <span className={styles.currentPage}>1</span> of{' '}
              <span className={styles.totalPages}>1</span>
            </div>
            <button className={styles.paginationButton}>Next</button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export const fields = (
  <ModuleFields>
    <FieldGroup name="headingGroup" label="Heading Options">
      <TextField name="title" label="Title" default="Featured Products" />
      <TextField
        name="subtitle"
        label="Subtitle"
        default="Shop our latest styles"
      />
    </FieldGroup>

    <FieldGroup name="dataGroup" label="Data Source">
      <TextField name="tableId" label="HubDB Table ID" required={true} />
      <NumberField name="maxProducts" label="Maximum Products" default={50} />
      <ChoiceField
        name="sortBy"
        label="Sort By"
        choices={[
          ['created_at', 'Date Created'],
          ['name', 'Product Name'],
          ['price', 'Price'],
          ['rating', 'Rating'],
        ]}
        default="created_at"
      />
      <ChoiceField
        name="sortDirection"
        label="Sort Direction"
        choices={[
          ['ASC', 'Ascending'],
          ['DESC', 'Descending'],
        ]}
        default="DESC"
      />
    </FieldGroup>

    <FieldGroup name="displayGroup" label="Display Options">
      <NumberField
        name="productsPerPage"
        label="Products Per Page"
        default={16}
      />
      <BooleanField
        name="enablePagination"
        label="Enable Pagination"
        default={false}
      />
    </FieldGroup>
  </ModuleFields>
);

export const meta = {
  label: 'Product List',
  icon: 'https://icons.hubspotcms.com/style/icons/ecommerce/list-alt',
  help: 'Display a grid of products with color variants and pagination options.',
};
