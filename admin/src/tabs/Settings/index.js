import React from 'react';
import { Map } from 'immutable';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

import { ToggleInput } from '@strapi/design-system/ToggleInput';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { TextInput } from '@strapi/design-system/TextInput';

import { onChangeSettings } from '../../state/actions/Sitemap';

const Settings = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.getIn(['sitemap', 'settings'], Map()));

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
