import React from 'react';
import { Select, Option } from '@strapi/design-system/Select';
import { Checkbox } from '@strapi/design-system/Checkbox';
import { Box } from '@strapi/design-system/Box';

const SelectLanguage = (props) => {
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
        label="Language"
        hint="Select a language."
        onChange={(newValue) => onChange(newValue)}
        value={value}
        disabled={value === 'und'}
      >
        {Object.entries(contentType.locales).map(([uid, displayName]) => {
          return <Option value={uid} key={uid}>{displayName}</Option>;
        })}
      </Select>
      <Box paddingTop={4} paddingBottom={4}>
        <Checkbox
          onValueChange={(cbValue) => {
            if (value === 'und') {
              onChange(null);
            } else {
              onChange('und');
            }
          }}
          value={value === 'und'}
          name="exclude-from-sitemap"
        >
          Same for all languages
        </Checkbox>
      </Box>
    </div>
  );
};

export default SelectLanguage;
