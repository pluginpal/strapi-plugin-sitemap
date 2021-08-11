import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Select, Label } from '@buffetjs/core';
import { isEmpty } from 'lodash';
import { getUidFieldsByContentType } from '../../helpers/getUidfields';

const SelectContentTypes = (props) => {
  const { edit } = useLocation();
  const [state, setState] = useState({ options: {} });

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

  const buildOptions = () => {
    const options = {};

    options['- Choose Content Type -'] = false;

    contentTypes.map((contentType) => {
      const uidFieldNames = getUidFieldsByContentType(contentType);

      if (!isEmpty(uidFieldNames)) {
        options[contentType.apiID] = uidFieldNames;
      }
    });

    return filterOptions(options);
  };

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      options: edit ? { [edit]: false } : buildOptions(),
    }));
  }, []);

  return (
    <>
      <Label htmlFor="select" message="Content Type" />
      <Select
        name="select"
        label="test"
        onChange={(e) => onChange(e, state.options[e.target.value])}
        options={Object.keys(state.options)}
        value={value}
        disabled={disabled}
      />
      <p style={{ color: '#9ea7b8', fontSize: 12, marginTop: 5, marginBottom: 20 }}>Select a content type.</p>
    </>
  );
};

export default SelectContentTypes;
