import React from 'react';

import { useIntl } from 'react-intl';

import { Grid, GridItem, TextInput, Select, Option } from '@strapi/design-system';

import form from '../mapper';

const CustomForm = (props) => {
  const { formatMessage } = useIntl();

  const {
    onChange,
    onCancel,
    modifiedState,
    id,
    uid,
    setUid,
  } = props;

  const handleCustomChange = (e) => {
    let contentType = e.target.value;

    if (contentType.match(/^[A-Za-z0-9-_.~/]*$/)) {
      setUid(contentType);
    } else {
      contentType = uid;
    }

    // Set initial values
    onCancel(false);
    Object.keys(form).map((input) => {
      onChange(contentType, input, form[input].value);
    });
  };

  return (
    <form>
      <Grid gap={6}>
        <GridItem col={6} s={12}>
          <TextInput
            label={formatMessage({ id: 'sitemap.Settings.Field.URL.Label', defaultMessage: 'Slug' })}
            name="url"
            value={uid}
            hint={formatMessage({ id: 'sitemap.Settings.Field.URL.Description', defaultMessage: 'This field forces the UID type regex' })}
            disabled={id}
            onChange={(e) => handleCustomChange(e)}
          />
        </GridItem>
        <GridItem col={6} s={12}>
          <Grid gap={4}>
            {Object.keys(form).map((input) => (
              <GridItem col={12} key={input}>
                <Select
                  name={input}
                  label={formatMessage({ id: `sitemap.Settings.Field.${input.replace(/^\w/, (c) => c.toUpperCase())}.Label`, defaultMessage: input.replace(/^\w/, (c) => c.toUpperCase()) })}
                  hint={formatMessage({ id: `sitemap.Settings.Field.${input.replace(/^\w/, (c) => c.toUpperCase())}.Description`, defaultMessage: '' })}
                  disabled={!uid}
                  onChange={(value) => onChange(uid, input, value)}
                  value={modifiedState.getIn([uid, input], form[input].value)}
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

export default CustomForm;
