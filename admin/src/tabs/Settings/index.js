import React, { useState } from 'react';
import { Map } from 'immutable';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

import { Button } from '@strapi/design-system/Button';
import { Typography } from '@strapi/design-system/Typography';
import { ToggleInput } from '@strapi/design-system/ToggleInput';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { TextInput } from '@strapi/design-system/TextInput';
import { useTheme } from '@strapi/design-system';

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
          label={formatMessage({ id: 'sitemap.Settings.Field.Hostname.Label' })}
          name="hostname"
          value={settings.get('hostname')}
          hint={formatMessage({ id: 'sitemap.Settings.Field.Hostname.Description' })}
          onChange={(e) => dispatch(onChangeSettings('hostname', e.target.value))}
        />
      </GridItem>
      {languages.length > 1 && (
        <GridItem col={12} s={12}>
          <Typography variant="pi" fontWeight="bold">
            Hostname overrides
          </Typography>
          <Button
            onClick={() => setOpen(true)}
            variant="tertiary"
            style={{ marginTop: '5px', marginBottom: '3px' }}
          >
            Configure
          </Button>
          <Typography variant="pi" style={{ color: theme.colors.neutral600 }}>
            Specify hostname per language
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
          hint={formatMessage({ id: 'sitemap.Settings.Field.IncludeHomepage.Description' })}
          label={formatMessage({ id: 'sitemap.Settings.Field.IncludeHomepage.Label' })}
          name="includeHomepage"
          onLabel="on"
          offLabel="off"
          checked={settings.get('includeHomepage')}
          onChange={(e) => dispatch(onChangeSettings('includeHomepage', e.target.checked))}
        />
      </GridItem>
      <GridItem col={12} s={12}>
        <ToggleInput
          hint={formatMessage({ id: 'sitemap.Settings.Field.ExcludeDrafts.Description' })}
          label={formatMessage({ id: 'sitemap.Settings.Field.ExcludeDrafts.Label' })}
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
