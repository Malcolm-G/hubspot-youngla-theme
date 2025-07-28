import { Island } from '@hubspot/cms-components';
import {
  ModuleFields,
  RepeatedFieldGroup,
  ImageField,
  TextField,
  ChoiceField,
  ColorField,
  NumberField,
  BooleanField,
  LinkField,
} from '@hubspot/cms-components/fields';
import Carousel from '../../islands/Carousel.jsx?island';
import Layout from '../../Layout.jsx';

/**
 * This module uses an Island component to provide client-side interactivity
 * for the carousel functionality (sliding, autoplay, navigation).
 *
 * The Island component allows us to hydrate the interactive parts of the carousel
 * when it becomes visible or on page load.
 */
export const Component = ({ fieldValues, hublParameters = {} }) => {
  const {
    slides = [],
    enableAutoplay,
    autoPlayDelay,
    showScrollArrow,
  } = fieldValues;

  return (
    <Layout>
      <Island
        module={Carousel}
        hydrateOn="load"
        slides={slides}
        enableAutoplay={enableAutoplay}
        autoPlayDelay={autoPlayDelay}
        showScrollArrow={showScrollArrow}
      />
    </Layout>
  );
};

export const fields = (
  <ModuleFields>
    <BooleanField
      name="enableAutoplay"
      label="Enable Autoplay"
      default={true}
      help="Enable automatic slide transitions"
    />
    <NumberField
      name="autoPlayDelay"
      label="Autoplay Delay (ms)"
      default={5000}
      help="Time between slide transitions in milliseconds"
    />
    <BooleanField
      name="showScrollArrow"
      label="Show Scroll Down Arrow"
      default={true}
      help="Show an animated down arrow that scrolls to the next section when clicked"
    />
    <RepeatedFieldGroup
      name="slides"
      label="Slides"
      occurrence={{
        min: 1,
        max: 5,
        default: 1,
      }}
      default={[
        {
          image: { src: 'https://w.wallhaven.cc/full/xe/wallhaven-xelmjo.jpg' },
          overlayText: 'New Drop',
          textColor: '#FFFFFF',
          textAlignment: 'Center',
          primaryButtonText: 'SHOP NOW',
          primaryButtonLink: {
            url: {
              content_id: null,
              type: 'EXTERNAL',
              href: '',
            },
          },
          primaryButtonColor: '#000000',
          primaryButtonTextColor: '#FFFFFF',
        },
      ]}
    >
      <ImageField
        name="image"
        label="Slide Image"
        required={true}
        help="Background image for this slide"
      />
      <TextField
        name="overlayText"
        label="Overlay Text"
        help="Text to display over the slide image"
      />
      <ColorField name="textColor" label="Text Color" default="#FFFFFF" />
      <ChoiceField
        name="textAlignment"
        label="Text Alignment"
        choices={[
          ['Left', 'left'],
          ['Center', 'center'],
          ['Right', 'right'],
        ]}
        default="Center"
      />
      <TextField
        name="primaryButtonText"
        label="Primary Button Text"
        help="Text for the primary call-to-action button"
      />
      <LinkField
        name="primaryButtonLink"
        label="Primary Button Link"
        help="URL for the primary button"
        default={{
          url: {
            content_id: null,
            type: 'EXTERNAL',
            href: '',
          },
        }}
      />
      <ColorField
        name="primaryButtonColor"
        label="Primary Button Color"
        default="#000000"
      />
      <ColorField
        name="primaryButtonTextColor"
        label="Primary Button Text Color"
        default="#FFFFFF"
      />
      <TextField
        name="secondaryButtonText"
        label="Secondary Button Text"
        help="Text for the secondary call-to-action button (optional)"
      />
      <LinkField
        name="secondaryButtonLink"
        label="Secondary Button Link"
        help="URL for the secondary button"
        default={{
          url: {
            content_id: null,
            type: 'EXTERNAL',
            href: '',
          },
        }}
      />
      <ColorField
        name="secondaryButtonColor"
        label="Secondary Button Color"
        default="#00000000"
      />
      <ColorField
        name="secondaryButtonTextColor"
        label="Secondary Button Text Color"
        default="#FFFFFF"
      />
    </RepeatedFieldGroup>
  </ModuleFields>
);

export const meta = {
  label: 'Image Carousel',
  icon: 'images',
};
