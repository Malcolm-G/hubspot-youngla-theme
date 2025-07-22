import { ModuleFields, TextField } from '@hubspot/cms-components/fields';
import styles from '../../../styles/topbar.module.css';

export function Component({ fieldValues }) {
  return (
    <div className={styles.topbar}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p>{fieldValues.topbarText}</p>
        </div>
      </div>
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <TextField
      name="topbarText"
      label="Topbar Text"
      default="FREE SHIPPING FOR ALL U.S. ORDERS OVER $75"
      help="The text to display in the topbar"
    />
  </ModuleFields>
);

export const meta = {
  label: 'Topbar',
  icon: 'brackets',
};
