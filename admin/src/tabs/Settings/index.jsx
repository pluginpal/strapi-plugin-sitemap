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
  SingleSelect,
  SingleSelectOption,
  useTheme,
} from '@strapi/design-system';

import { onChangeSettings } from '../../state/actions/Sitemap';
import HostnameModal from '../../components/HostnameModal';
import { DEFAULT_LANGUAGE_URL_TYPE_DEFAULT_LOCALE, DEFAULT_LANGUAGE_URL_TYPE_OTHER } from '../../config/constants';

const Settings = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const languages = useSelector((store) => store.getIn(['sitemap', 'languages'], {}));
  const settings = useSelector((state) => state.getIn(['sitemap', 'settings'], Map()));
  const hostnameOverrides = useSelector((state) => state.getIn(['sitemap', 'settings', 'hostname_overrides'], {}));
  const [inputVisible, setInputVisible] = useState(settings.get('defaultLanguageUrlType') === DEFAULT_LANGUAGE_URL_TYPE_OTHER);
  const theme = useTheme();

  const saveHostnameOverrides = (hostnames) => {
    dispatch(onChangeSettings('hostname_overrides', hostnames));
    setOpen(false);
  };

  const handleDefaultLanguageUrlTypeChange = (value = '') => {
    dispatch(onChangeSettings('defaultLanguageUrlType', value));
    if (value === DEFAULT_LANGUAGE_URL_TYPE_OTHER) dispatch(onChangeSettings('defaultLanguageUrl', undefined));
    setInputVisible(value === DEFAULT_LANGUAGE_URL_TYPE_OTHER);
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
      <GridItem col={6} s={12}>
        <SingleSelect
          hint={formatMessage({ id: 'sitemap.Settings.Field.DefaultLanguageUrlType.Description', defaultMessage: 'Generate a link tag and attribute hreflang=x-default with the URL of your choice.' })}
          label={formatMessage({ id: 'sitemap.Settings.Field.DefaultLanguageUrlType.Label', defaultMessage: 'Default language URL type' })}
          name="defaultLanguageUrlType"
          onLabel="on"
          offLabel="off"
          value={settings.get('defaultLanguageUrlType')}
          onChange={handleDefaultLanguageUrlTypeChange}
          onClear={handleDefaultLanguageUrlTypeChange}
        >
          <SingleSelectOption value="">
            {formatMessage({ id: 'sitemap.Settings.Field.DefaultLanguageUrlType.Option.Disabled', defaultMessage: 'Disabled' })}
          </SingleSelectOption>
          <SingleSelectOption value={DEFAULT_LANGUAGE_URL_TYPE_DEFAULT_LOCALE}>
            {formatMessage({ id: 'sitemap.Settings.Field.DefaultLanguageUrlType.Option.DefaultLocale', defaultMessage: 'Default language URL of bundles (generated from default locale URL)' })}
          </SingleSelectOption>
          <SingleSelectOption value={DEFAULT_LANGUAGE_URL_TYPE_OTHER}>
            {formatMessage({ id: 'sitemap.Settings.Field.DefaultLanguageUrlType.Option.Other', defaultMessage: 'Other' })}
          </SingleSelectOption>
        </SingleSelect>
      </GridItem>
      {inputVisible && (
        <GridItem col={12} s={12}>
          <TextInput
            placeholder="https://www.strapi.io/language-selector"
            hint={formatMessage({ id: 'sitemap.Settings.Field.DefaultLanguageUrl.Description', defaultMessage: 'E.g. URL of your website language selector.' })}
            label={formatMessage({ id: 'sitemap.Settings.Field.DefaultLanguageUrl.Label', defaultMessage: 'Custom default language URL' })}
            name="defaultLanguageUrl"
            required
            value={settings.get('defaultLanguageUrl')}
            onChange={(e) => dispatch(onChangeSettings('defaultLanguageUrl', e.target.value))}
          />
        </GridItem>
      )}
    </Grid>
  );
};

export default Settings;
