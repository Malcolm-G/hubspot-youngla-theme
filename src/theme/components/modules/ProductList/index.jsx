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
import ProductList from '../../islands/ProductList.jsx?island';
import Layout from '../../Layout.jsx';

/**
 * This module displays a list of product cards that can be filtered by category.
 * Each product card is an Island component that provides client-side interactivity
 * for carousel functionality and color variant selection.
 */

export const Component = ({ fieldValues, hublParameters = {} }) => {
  console.log('fieldValues:', fieldValues);
  const flatValues = {
    ...fieldValues.headingGroup,
    ...fieldValues.dataGroup,
    ...fieldValues.displayGroup,
  };
  return (
    <Layout>
      <Island module={ProductList} hydrateOn="visible" {...flatValues} />
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
      <TextField
        name="tableName"
        label="Product Table Name"
        required={true}
        default="youngla_product"
      />
      <TextField
        name="variantsTableName"
        label="Variants Table Name"
        required={true}
        default="youngla_product_variant"
      />
      <TextField
        name="imagesTableName"
        label="Images Table Name"
        required={true}
        default="youngla_product_image"
      />
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
