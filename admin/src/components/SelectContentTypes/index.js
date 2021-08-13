import React from 'react';
import { Select, Label } from '@buffetjs/core';

const SelectContentTypes = (props) => {

  const {
    contentTypes,
    onChange,
    disabled,
    value,
    modifiedContentTypes,
  } = props;

  const filterOptions = (options) => {
    const newOptions = {};

    // Remove the contentypes which are allready set in the sitemap.
    Object.entries(options).map(([i, e]) => {
      if (!modifiedContentTypes.get(i) || value === i) {
        newOptions[i] = e;
      }
    });

    return newOptions;
  };

  const options = filterOptions(contentTypes);

  return (
    <>
      <Label htmlFor="select" message="Content Type" />
      <Select
        name="select"
        label="test"
        onChange={(e) => onChange(e)}
        options={Object.keys(options)}
        value={value}
        disabled={disabled}
      />
      <p style={{ color: '#9ea7b8', fontSize: 12, marginTop: 5, marginBottom: 20 }}>Select a content type.</p>
    </>
  );
};

export default SelectContentTypes;
