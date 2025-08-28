import { Island } from '@hubspot/cms-components';
import {
  ModuleFields,
  MenuField,
  TextField,
} from '@hubspot/cms-components/fields';
import MainNavigation from '../../islands/MainNavigation.jsx?island';

/**
 * This module displays the main navigation bar with:
 * - Responsive mobile hamburger menu
 * - Dynamic menu interactions
 * - Contact information display
 */

export const Component = ({ fieldValues }) => {
  return <Island module={MainNavigation} hydrateOn="load" {...fieldValues} />;
};

export const fields = (
  <ModuleFields>
    <TextField
      name="questionsText"
      label="Questions Text"
      default="QUESTIONS?"
      help="The text that appears before the phone number"
    />
    <TextField
      name="phoneNumber"
      label="Phone Number"
      default="(818) 206-8764"
      help="The contact phone number to display"
    />
    <MenuField
      name="menu"
      label="Navigation Menu"
      default={[
        { label: 'FOR HIM', link: '#' },
        { label: 'FOR HER', link: '#' },
        { label: 'NEW DROP', link: '#' },
        { label: 'COLLABS', link: '#' },
        { label: 'LOOKBOOK', link: '#' },
      ]}
    />
  </ModuleFields>
);

export const meta = {
  label: 'Main Navigation',
  icon: 'menu',
};
