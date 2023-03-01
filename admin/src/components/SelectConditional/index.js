import React from 'react';
import { Select, Option, TextInput, GridItem } from '@strapi/design-system';
import { useIntl } from 'react-intl';

const operators = [
  '$not',
  '$eq',
  '$eqi',
  '$ne',
  '$in',
  '$notIn',
  '$lt',
  '$lte',
  '$gt',
  '$gte',
  '$between',
  '$contains',
  '$notContains',
  '$containsi',
  '$notContainsi',
  '$startsWith',
  '$endsWith',
  '$null',
  '$notNull'
]

const SelectConditional = (props) => {
  const { formatMessage } = useIntl();

  const {
    contentType,
    disabled,
    onConditionChange,
    onOperatorChange,
    onValueChange,
    condition,
    conditionOperator,
    conditionValue
  } = props;

  return (
    <>
      <GridItem col={4}>
        <Select
          name="select"
          label={formatMessage({ id: 'sitemap.Settings.Field.SelectConditional.Label', defaultMessage: 'Attribute' })}
          hint={formatMessage({ id: 'sitemap.Settings.Field.SelectConditional.Description', defaultMessage: 'Select an attribute' })}
          disabled={disabled}
          onChange={(condition) => onConditionChange(condition)}
          value={condition}
        >
          {contentType && contentType.attributes.map((attribute) => {
            return <Option value={attribute} key={attribute}>{attribute}</Option>;
          })}
        </Select>
      </GridItem>
      <GridItem col={2}>
        <Select
          name="select"
          label={formatMessage({ id: 'sitemap.Settings.Field.SelectOperator.Label', defaultMessage: 'Operator' })}
          hint={formatMessage({ id: 'sitemap.Settings.Field.SelectOperator.Description', defaultMessage: 'Select an operator' })}
          disabled={disabled}
          onChange={(operator) => onOperatorChange(operator)}
          value={conditionOperator}
        >
          {operators.map((operator) => {
            return <Option value={operator} key={operator}>{operator}</Option>;
          })}
        </Select>
      </GridItem>
      <GridItem col={6}>
        <TextInput
          disabled={disabled}
          label={formatMessage({ id: 'sitemap.Settings.Field.SelectConditionValue.Label', defaultMessage: 'Value' })}
          name="conditionValue"
          hint={formatMessage({ id: 'sitemap.Settings.Field.SelectConditionValue.Description', defaultMessage: '"Text", true, 2, etc' })}
          onChange={e => onValueChange(e.target.value)}
          value={conditionValue}
        />
      </GridItem>
    </>
  );
};

export default SelectConditional;
