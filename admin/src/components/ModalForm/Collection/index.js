import React, { useEffect, useRef, useState } from 'react';

import { useIntl } from 'react-intl';
import { isEmpty } from 'lodash/fp';
import styled from 'styled-components';

import {
  Grid,
  GridItem,
  TextInput,
  Select,
  Option,
  Popover,
  Box,
  Stack,
  Checkbox,
  Typography,
  Flex,
  Button
} from '@strapi/design-system';

import SelectContentTypes from '../../SelectContentTypes';

import form from '../mapper';
import SelectLanguage from '../../SelectLanguage';
import useActiveElement from '../../../helpers/useActiveElement';
import SelectConditional from '../../SelectConditional';

const CollectionForm = (props) => {
  const { formatMessage } = useIntl();
  const activeElement = useActiveElement();
  const [showPopover, setShowPopover] = useState(false);
  const [conditionCount, setConditionCount] = useState(0);
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

  useEffect(() => {
    // get the initial condition count
    let count = 0;
    while (modifiedState.getIn([uid, 'languages', langcode, `condition${count}`], '') !== '') {
      count++;
    }
    setConditionCount(count);
  }, [uid, langcode]);

  const patternHint = () => {
    const base = formatMessage({ id: 'sitemap.Settings.Field.Pattern.DescriptionPart1', defaultMessage: 'Create a dynamic URL pattern' });
    let suffix = '';
    if (allowedFields[uid]) {
      suffix = ` ${formatMessage({ id: 'sitemap.Settings.Field.Pattern.DescriptionPart2', defaultMessage: 'using' })} `;
      allowedFields[uid].map((fieldName, i) => {
        if (i === 0) {
          suffix = `${suffix}[${fieldName}]`;
        } else if (allowedFields[uid].length !== i + 1) {
          suffix = `${suffix}, [${fieldName}]`;
        } else {
          suffix = `${suffix} ${formatMessage({ id: 'sitemap.Settings.Field.Pattern.DescriptionPart3', defaultMessage: 'and' })} [${fieldName}]`;
        }
      });
    }

    return base + suffix;
  };

  const handleRemoveCondition = () => {
    onChange(uid, langcode, `condition${conditionCount - 1}`, '')
    onChange(uid, langcode, `conditionOperator${conditionCount - 1}`, '')
    onChange(uid, langcode, `conditionValue${conditionCount - 1}`, '')
    setConditionCount(conditionCount - 1)
  };

  const HoverBox = styled(Box)`
    cursor: pointer;
    &:hover:not([aria-disabled='true']) {
      background: ${({ theme }) => theme.colors.primary100};
    }
  `;

  return (
    <form style={{ paddingTop: 30 }}>
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
                  label={formatMessage({ id: 'sitemap.Settings.Field.Pattern.Label', defaultMessage: 'Pattern' })}
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
                  label={formatMessage({ id: `sitemap.Settings.Field.${input.replace(/^\w/, (c) => c.toUpperCase())}.Label`, defaultMessage: input.replace(/^\w/, (c) => c.toUpperCase()) })}
                  hint={formatMessage({ id: `sitemap.Settings.Field.${input.replace(/^\w/, (c) => c.toUpperCase())}.Description`, defaultMessage: '' })}
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
            <GridItem col={12}>
              <Checkbox
                onValueChange={(cbValue) => {
                  onChange(uid, langcode, 'includeLastmod', cbValue);
                }}
                value={modifiedState.getIn([uid, 'languages', langcode, 'includeLastmod'], true)}
                disabled={!uid || (contentTypes[uid].locales && !langcode)}
                hint={formatMessage({ id: 'sitemap.Settings.Field.IncludeLastmod.Description', defaultMessage: 'Adds a <lastmod> tag to all the URLs of this type.' })}
              >
                {formatMessage({ id: 'sitemap.Settings.Field.IncludeLastmod.Label', defaultMessage: 'Lastmod' })}
              </Checkbox>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
      {conditionCount === 0
        ? <Flex direction={"column"} alignItems={"stretch"} style={{ marginTop: '3rem' }}>
          <Flex direction={"row"} justifyContent={"space-between"}>
            <Flex direction={"column"} justifyContent={"center"} alignItems={"flex-start"}>
              <Typography variant="pi" fontWeight="bold">
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Label', defaultMessage: 'Conditional Filtering' })}
              </Typography>
              <Typography>
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Description', defaultMessage: 'Only include URLs that match the following condition.' })}
              </Typography>
            </Flex>
            <Flex direction={"row"} alignItems={"center"} gap={2}>
              <Button onClick={() => setConditionCount(conditionCount + 1)}>
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Add', defaultMessage: 'Add' })}
              </Button>
              <Button variant={"secondary"} onClick={() => handleRemoveCondition()}>
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Remove', defaultMessage: 'Remove' })}
              </Button>
            </Flex>
          </Flex>
        </Flex>
        : <Flex direction={"column"} alignItems={"stretch"} style={{ marginTop: '3rem' }}>
          <Flex direction={"row"} justifyContent={"space-between"} style={{ marginBottom: '2rem' }}>
            <Flex direction={"column"} justifyContent={"center"} alignItems={"flex-start"}>
              <Typography variant="pi" fontWeight="bold">
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Label', defaultMessage: 'Conditional Filtering' })}
              </Typography>
              <Typography>
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Description', defaultMessage: 'Only include URLs that match the following conditions.' })}
              </Typography>
            </Flex>
            <Flex direction={"row"} alignItems={"center"} gap={2}>
              <Button onClick={() => setConditionCount(conditionCount + 1)}>
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Add', defaultMessage: 'Add' })}
              </Button>
              <Button variant={"secondary"} onClick={() => handleRemoveCondition()}>
                {formatMessage({ id: 'sitemap.Settings.Field.Condition.Remove', defaultMessage: 'Remove' })}
              </Button>
            </Flex>
          </Flex>
          {Array.from(Array(conditionCount).keys()).map((i) => (
            <Grid gap={4} style={{ marginBottom: "1rem" }}>
              <SelectConditional
                disabled={!uid || (contentTypes[uid].locales && !langcode)}
                contentType={contentTypes[uid]}
                onConditionChange={(value) => onChange(uid, langcode, `condition${i}`, value)}
                onOperatorChange={(value) => onChange(uid, langcode, `conditionOperator${i}`, value)}
                onValueChange={(value) => onChange(uid, langcode, `conditionValue${i}`, value)}
                condition={modifiedState.getIn([uid, 'languages', langcode, `condition${i}`], '')}
                conditionOperator={modifiedState.getIn([uid, 'languages', langcode, `conditionOperator${i}`], '')}
                conditionValue={modifiedState.getIn([uid, 'languages', langcode, `conditionValue${i}`], '')}
              />
            </Grid>))
          }
        </Flex>
      }
    </form>
  );
};

export default CollectionForm;
