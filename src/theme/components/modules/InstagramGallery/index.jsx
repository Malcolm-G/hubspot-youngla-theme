import { Island } from '@hubspot/cms-components';
import {
  ModuleFields,
  TextField,
  BooleanField,
  NumberField,
  FieldGroup,
  UrlField,
} from '@hubspot/cms-components/fields';
import InstagramGallery from '../../islands/InstagramGallery.jsx?island';
import Layout from '../../Layout.jsx';

/**
 * This module displays an Instagram gallery by calling a serverless function
 * to scrape images from the YoungLA website's Instagram section.
 */

export const Component = ({ fieldValues, hublParameters = {} }) => {
  console.log('Instagram Gallery fieldValues:', fieldValues);
  const flatValues = {
    ...fieldValues.contentGroup,
    ...fieldValues.configGroup,
    ...fieldValues.displayGroup,
  };
  return (
    <Layout>
      <Island module={InstagramGallery} hydrateOn="visible" {...flatValues} />
    </Layout>
  );
};

export const fields = (
  <ModuleFields>
    <FieldGroup name="contentGroup" label="Content Settings">
      <TextField
        name="title"
        label="Gallery Title"
        default="Follow us on Instagram @youngla"
      />
      <UrlField
        name="instagramUrl"
        label="Instagram Profile URL"
        default={{
          content_id: null,
          href: 'https://instagram.com/youngla',
          type: 'EXTERNAL',
        }}
      />
      <BooleanField name="showTitle" label="Show Title" default={true} />
    </FieldGroup>

    <FieldGroup name="configGroup" label="Configuration">
      <TextField
        name="serverlessEndpoint"
        label="Serverless Function Endpoint"
        default="/hs/serverless/instagram-fetch"
        help="The endpoint path for your Instagram scraping serverless function"
      />
      <NumberField
        name="maxImages"
        label="Maximum Images to Display"
        default={12}
        min={1}
        max={24}
      />
    </FieldGroup>

    <FieldGroup name="displayGroup" label="Display Options">
      <BooleanField
        name="autoRefresh"
        label="Auto Refresh (every 30 minutes)"
        default={true}
        help="Automatically refresh the gallery to show new posts"
      />
    </FieldGroup>
  </ModuleFields>
);

export const meta = {
  label: 'Instagram Gallery',
  icon: 'https://icons.hubspotcms.com/style/icons/social/instagram',
  help: 'Display Instagram images by scraping the YoungLA website Instagram section via serverless function.',
};
