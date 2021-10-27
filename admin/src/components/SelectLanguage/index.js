import React from 'react';
import { Select, Option } from '@strapi/design-system/Select';

const SelectLanguage = (props) => {
  const {
    contentType,
    onChange,
    value,
  } = props;

  if (!contentType) return null;
  if (!contentType.locales) return null;

  return (
    <Select
      name="select"
      label="Language"
      hint="Select a language."
      onChange={(newValue) => onChange(newValue)}
      value={value}
    >
      {Object.entries(contentType.locales).map(([uid, displayName]) => {
        return <Option value={uid} key={uid}>{displayName}</Option>;
      })}
    </Select>
  );
};

export default SelectLanguage;
