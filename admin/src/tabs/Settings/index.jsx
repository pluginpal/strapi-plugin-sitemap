import React, { useState } from 'react';
import { Map } from 'immutable';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

import {
  Button,
  Typography,
  ToggleInput,
  Grid,
  GridItem,
  TextInput,
  useTheme,
} from '@strapi/design-system';

import { onChangeSettings } from '../../state/actions/Sitemap';
import HostnameModal from '../../components/HostnameModal';

const Settings = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const languages = useSelector((store) => store.getIn(['sitemap', 'languages'], {}));
  const settings = useSelector((state) => state.getIn(['sitemap', 'settings'], Map()));
  const hostnameOverrides = useSelector((state) => state.getIn(['sitemap', 'settings', 'hostname_overrides'], {}));
  const theme = useTheme();

  const saveHostnameOverrides = (hostnames) => {
    dispatch(onChangeSettings('hostname_overrides', hostnames));
    setOpen(false);
  };

  return (
    <Grid gap={4}>
      <GridItem col={6} s={12}>
        <TextInput
          placeholder="https://www.strapi.io"
          label={formatMessage({ id: 'sitemap.Settings.Field.Hostname.Label', defaultMessage: 'Hostname' })}
          name="hostname"
          value={settings.get('hostname')}
          hint={formatMessage({ id: 'sitemap.Settings.Field.Hostname.Description', defaultMessage: 'The URL of your website' })}
          onChange={(e) => dispatch(onChangeSettings('hostname', e.target.value))}
        />
      </GridItem>
      {languages.length > 1 && (
        <GridItem col={12} s={12}>
          <Typography variant="pi" fontWeight="bold">
            {formatMessage({ id: 'sitemap.Settings.Field.HostnameOverrides.Label', defaultMessage: 'Hostname overrides' })}
          </Typography>
          <Button
            onClick={() => setOpen(true)}
            variant="tertiary"
            style={{ marginTop: '5px', marginBottom: '3px' }}
          >
            {formatMessage({ id: 'sitemap.Settings.Field.HostnameOverrides.Button', defaultMessage: 'Configure' })}
          </Button>
          <Typography variant="pi" style={{ color: theme.colors.neutral600 }}>
            {formatMessage({ id: 'sitemap.Settings.Field.HostnameOverrides.Description', defaultMessage: 'Specify hostname per language' })}
          </Typography>
          <HostnameModal
            isOpen={open}
            languages={languages}
            hostnameOverrides={hostnameOverrides}
            onSave={saveHostnameOverrides}
            onCancel={() => setOpen(false)}
          />
        </GridItem>
      )}
      <GridItem col={12} s={12}>
        <ToggleInput
          hint={formatMessage({ id: 'sitemap.Settings.Field.IncludeHomepage.Description', defaultMessage: 'Include a \'/\' entry when none is present.' })}
          label={formatMessage({ id: 'sitemap.Settings.Field.IncludeHomepage.Label', defaultMessage: 'Include home page' })}
          name="includeHomepage"
          onLabel="on"
          offLabel="off"
          checked={settings.get('includeHomepage')}
          onChange={(e) => dispatch(onChangeSettings('includeHomepage', e.target.checked))}
        />
      </GridItem>
      <GridItem col={12} s={12}>
        <ToggleInput
          hint={formatMessage({ id: 'sitemap.Settings.Field.ExcludeDrafts.Description', defaultMessage: 'Remove all draft entries from the sitemap.' })}
          label={formatMessage({ id: 'sitemap.Settings.Field.ExcludeDrafts.Label', defaultMessage: 'Exclude drafts' })}
          name="excludeDrafts"
          onLabel="on"
          offLabel="off"
          checked={settings.get('excludeDrafts')}
          onChange={(e) => dispatch(onChangeSettings('excludeDrafts', e.target.checked))}
        />
      </GridItem>
    </Grid>
  );
};

export default Settings;
