import React from 'react';

import { useIntl } from 'react-intl';

import { Grid, GridItem } from '@strapi/parts/Grid';
import { TextInput } from '@strapi/parts/TextInput';
import { Select, Option } from '@strapi/parts/Select';

import SelectContentTypes from '../../SelectContentTypes';

import form from '../mapper';
import SelectLanguage from '../../SelectLanguage';

const CollectionForm = (props) => {
  const { formatMessage } = useIntl();

  const {
    contentTypes,
    allowedFields,
    onChange,
    onCancel,
    id,
    modifiedState,
    uid,
    setUid,
    langcode,
    setLangcode,
    patternInvalid,
    setPatternInvalid,
  } = props;

  const handleSelectChange = (contentType, lang = 'und') => {
    setLangcode(lang);
    setUid(contentType);
    onCancel(false);
  };

  const patternHint = () => {
    const base = 'Create a dynamic URL pattern';
    let suffix = '';
    if (allowedFields[uid]) {
      suffix = ' using ';
      allowedFields[uid].map((fieldName, i) => {
        if (i === 0) {
          suffix = `${suffix}[${fieldName}]`;
        } else if (allowedFields[uid].length !== i + 1) {
          suffix = `${suffix}, [${fieldName}]`;
        } else {
          suffix = `${suffix} and [${fieldName}]`;
        }
      });
    }

    return base + suffix;
  };

  return (
    <form style={{ borderTop: '1px solid #f5f5f6', paddingTop: 30 }}>
      <Grid gap={6}>
        <GridItem col={6} s={12}>
          <Grid gap={4}>
            <GridItem col={12}>
              <SelectContentTypes
                contentTypes={contentTypes}
                onChange={(value) => handleSelectChange(value)}
                value={uid}
                disabled={id}
                modifiedContentTypes={modifiedState}
              />
            </GridItem>
            <GridItem col={12}>
              <SelectLanguage
                contentType={contentTypes[uid]}
                onChange={(value) => handleSelectChange(uid, value)}
                value={langcode}
              />
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem col={6} s={12}>
          <Grid gap={4}>
            <GridItem col={12}>
              <TextInput
                label={formatMessage({ id: 'sitemap.Settings.Field.Pattern.Label' })}
                name="pattern"
                value={modifiedState.getIn([uid, 'languages', langcode, 'pattern'], '')}
                hint={patternHint()}
                disabled={!uid || (contentTypes[uid].locales && langcode === 'und')}
                error={patternInvalid.invalid ? patternInvalid.message : ''}
                placeholder="/en/pages/[id]"
                onChange={async (e) => {
                  if (e.target.value.match(/^[A-Za-z0-9-_.~[\]/]*$/)) {
                    onChange(uid, langcode, 'pattern', e.target.value);
                    setPatternInvalid({ invalid: false });
                  }
                }}
              />
            </GridItem>
            {Object.keys(form).map((input) => (
              <GridItem col={12} key={input}>
                <Select
                  name={input}
                  {...form[input]}
                  disabled={!uid || (contentTypes[uid].locales && langcode === 'und')}
                  onChange={(value) => onChange(uid, langcode, input, value)}
                  value={modifiedState.getIn([uid, 'languages', langcode, input], form[input].value)}
                >
                  {form[input].options.map((option) => (
                    <Option value={option} key={option}>{option}</Option>
                  ))}
                </Select>
              </GridItem>
            ))}
          </Grid>
        </GridItem>
      </Grid>
    </form>
  );
};

export default CollectionForm;
