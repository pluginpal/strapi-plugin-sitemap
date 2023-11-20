import React from 'react';
import { Select, Option, Checkbox, Box } from '@strapi/design-system';
import { useIntl } from 'react-intl';

const SelectLanguage = (props) => {
  const { formatMessage } = useIntl();

  const {
    contentType,
    onChange,
    value,
  } = props;

  if (!contentType) return null;
  if (!contentType.locales) return null;

  return (
    <div>
      <Select
        name="select"
        label={formatMessage({ id: 'sitemap.Settings.Field.SelectLanguage.Label', defaultMessage: 'Language' })}
        hint={formatMessage({ id: 'sitemap.Settings.Field.SelectLanguage.Description', defaultMessage: 'Select a language.' })}
        onChange={(newValue) => onChange(newValue)}
        value={value}
        // disabled={value === 'und'}
      >
        {Object.entries(contentType.locales).map(([uid, displayName]) => {
          return <Option value={uid} key={uid}>{displayName}</Option>;
        })}
      </Select>
      {/*<Box paddingTop={4} paddingBottom={4}>*/}
      {/*  <Checkbox*/}
      {/*    onValueChange={(cbValue) => {*/}
      {/*      if (value === 'und') {*/}
      {/*        onChange(null);*/}
      {/*      } else {*/}
      {/*        onChange('und');*/}
      {/*      }*/}
      {/*    }}*/}
      {/*    value={value === 'und'}*/}
      {/*  >*/}
      {/*    {formatMessage({ id: 'sitemap.Settings.Field.SelectLanguage.SameForAll', defaultMessage: 'Same for all languages' })}*/}
      {/*  </Checkbox>*/}
      {/*</Box>*/}
    </div>
  );
};

export default SelectLanguage;
