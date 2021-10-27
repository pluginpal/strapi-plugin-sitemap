import React from 'react';
import { Select, Option } from '@strapi/design-system/Select';

const SelectContentTypes = (props) => {
  const {
    contentTypes,
    onChange,
    disabled,
    value,
  } = props;

  return (
    <Select
      name="select"
      label="Content Type"
      hint="Select a content type."
      disabled={disabled}
      onChange={(newValue) => onChange(newValue)}
      value={value}
    >
      {Object.entries(contentTypes).map(([uid, { displayName }]) => {
        return <Option value={uid} key={uid}>{displayName}</Option>;
      })}
    </Select>
  );
};

export default SelectContentTypes;
