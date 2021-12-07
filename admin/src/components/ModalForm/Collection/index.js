import React, { useEffect, useRef, useState } from 'react';

import { useIntl } from 'react-intl';
import { isEmpty } from 'lodash/fp';
import styled from 'styled-components';

import { Grid, GridItem } from '@strapi/design-system/Grid';
import { TextInput } from '@strapi/design-system/TextInput';
import { Select, Option } from '@strapi/design-system/Select';
import { Popover } from '@strapi/design-system/Popover';
import { Box } from '@strapi/design-system/Box';
import { Stack } from '@strapi/design-system/Stack';

import SelectContentTypes from '../../SelectContentTypes';

import form from '../mapper';
import SelectLanguage from '../../SelectLanguage';
import useActiveElement from '../../../helpers/useActiveElement';

const CollectionForm = (props) => {
  const { formatMessage } = useIntl();
  const activeElement = useActiveElement();
  const [showPopover, setShowPopover] = useState(false);
  const patternRef = useRef();

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

  useEffect(() => {
    if (
      modifiedState.getIn([uid, 'languages', langcode, 'pattern'], '').endsWith('[')
      && activeElement.name === 'pattern'
    ) {
      setShowPopover(true);
    } else {
      setShowPopover(false);
    }
  }, [modifiedState.getIn([uid, 'languages', langcode, 'pattern'], ''), activeElement]);

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

  const HoverBox = styled(Box)`
    cursor: pointer;
    &:hover:not([aria-disabled='true']) {
      background: ${({ theme }) => theme.colors.primary100};
    }
  `;

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
                disabled={!isEmpty(id)}
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
              <div ref={patternRef}>
                <TextInput
                  label={formatMessage({ id: 'sitemap.Settings.Field.Pattern.Label' })}
                  name="pattern"
                  value={modifiedState.getIn([uid, 'languages', langcode, 'pattern'], '')}
                  hint={patternHint()}
                  disabled={!uid || (contentTypes[uid].locales && !langcode)}
                  error={patternInvalid.invalid ? patternInvalid.message : ''}
                  placeholder="/en/pages/[id]"
                  onChange={async (e) => {
                    if (e.target.value.match(/^[A-Za-z0-9-_.~[\]/]*$/)) {
                      onChange(uid, langcode, 'pattern', e.target.value);
                      setPatternInvalid({ invalid: false });
                    }
                  }}
                />
              </div>
              {(patternRef && showPopover) && (
                <Popover
                  source={patternRef}
                  spacing={-14}
                  fullWidth
                >
                  <Stack size={1}>
                    {allowedFields[uid].map((fieldName) => (
                      <HoverBox
                        key={fieldName}
                        padding={2}
                        onClick={() => {
                          const newPattern = `${modifiedState.getIn([uid, 'languages', langcode, 'pattern'], '')}${fieldName}]`;
                          onChange(uid, langcode, 'pattern', newPattern);
                        }}
                      >
                        {fieldName}
                      </HoverBox>
                    ))}
                  </Stack>
                </Popover>
              )}
            </GridItem>
            {Object.keys(form).map((input) => (
              <GridItem col={12} key={input}>
                <Select
                  name={input}
                  {...form[input]}
                  disabled={!uid || (contentTypes[uid].locales && !langcode)}
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
