import React from 'react';

import { useIntl } from 'react-intl';

import { Grid, GridItem } from '@strapi/parts/Grid';
import { TextInput } from '@strapi/parts/TextInput';
import { Select, Option } from '@strapi/parts/Select';
import { Tabs, Tab, TabGroup, TabPanels, TabPanel } from '@strapi/parts/Tabs';

import SelectContentTypes from '../../SelectContentTypes';

import form from '../mapper';

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
    patternInvalid,
    setPatternInvalid,
  } = props;

  const handleSelectChange = (contentType) => {
    setUid(contentType);

    // Set initial values
    onCancel(false);
    Object.keys(form).map((input) => {
      onChange(contentType, input, form[input].value);
    });
    onChange(contentType, 'excluded', []);
  };

  const patternHint = () => {
    const base = 'Create a dynamic URL pattern';
    let suffix = '';
    console.log(allowedFields[uid]);
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
    <TabGroup label="Some stuff for the label" id="tabs" variant="simple">
      <Tabs style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Tab>Base settings</Tab>
        <Tab>Advanced settings</Tab>
      </Tabs>
      <form style={{ borderTop: '1px solid #f5f5f6', paddingTop: 30 }}>
        <Grid gap={6}>
          <GridItem col={6} s={12}>
            <SelectContentTypes
              contentTypes={contentTypes}
              onChange={(value) => handleSelectChange(value)}
              value={uid}
              disabled={id}
              modifiedContentTypes={modifiedState}
            />
          </GridItem>
          <GridItem col={6} s={12}>
            <TabPanels>
              <TabPanel>
                <div>
                  <TextInput
                    label={formatMessage({ id: 'sitemap.Settings.Field.Pattern.Label' })}
                    name="pattern"
                    value={modifiedState.getIn([uid, 'pattern'], '')}
                    hint={patternHint()}
                    disabled={!uid}
                    error={patternInvalid.invalid ? patternInvalid.message : ''}
                    placeholder="/en/pages/[id]"
                    onChange={async (e) => {
                      if (e.target.value.match(/^[A-Za-z0-9-_.~[\]/]*$/)) {
                        onChange(uid, 'pattern', e.target.value);
                        setPatternInvalid({ invalid: false });
                      }
                    }}
                  />
                </div>
              </TabPanel>
              <TabPanel>
                {Object.keys(form).map((input) => (
                  <Select
                    name={input}
                    key={input}
                    {...form[input]}
                    disabled={!uid}
                    onChange={(value) => onChange(uid, input, value)}
                    value={modifiedState.getIn([uid, input], form[input].value)}
                  >
                    {form[input].options.map((option) => (
                      <Option value={option} key={option}>{option}</Option>
                    ))}
                  </Select>
                ))}
              </TabPanel>
            </TabPanels>
          </GridItem>
        </Grid>
      </form>
    </TabGroup>
  );
};

export default CollectionForm;
