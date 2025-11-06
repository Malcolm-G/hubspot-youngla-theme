import { Island } from '@hubspot/cms-components';
import { getSecret } from '@hubspot/cms-components';
import {
  ModuleFields,
  TextField,
  BooleanField,
  NumberField,
  FieldGroup,
} from '@hubspot/cms-components/fields';
import Gallery from '../../islands/Gallery.jsx?island';
import Layout from '../../Layout.jsx';

/**
 * This module displays a gallery of random images by calling a serverless function.
 */

export const Component = ({ fieldValues, hublParameters = {} }) => {
  // Get the HubSpot token from secrets (server-side only)
  const hubspotToken = getSecret('HUBSPOT_TOKEN');
  const flatValues = {
    ...fieldValues.contentGroup,
    ...fieldValues.configGroup,
    ...fieldValues.displayGroup,
    hubspotToken,
  };
  return (
    <Layout>
      <Island module={Gallery} hydrateOn="load" {...flatValues} />
    </Layout>
  );
};

export const fields = (
  <ModuleFields>
    <FieldGroup name="contentGroup" label="Content Settings">
      <TextField
        name="title"
        label="Gallery Title"
        default="YoungLA Gallery (Serverless function that pulls in random images)"
      />
      <BooleanField name="showTitle" label="Show Title" default={true} />
    </FieldGroup>
    <FieldGroup name="configGroup" label="Configuration">
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
        help="Automatically refresh the gallery to show new images"
      />
    </FieldGroup>
  </ModuleFields>
);

export const meta = {
  label: 'Gallery',
  icon: 'https://picsum.photos/32',
  help: 'Display random images by calling a serverless function.',
};
