import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Select, Label } from '@buffetjs/core';
import { isEmpty } from 'lodash';

const SelectContentTypes = (props) => {
  const { edit } = useLocation();
  const [state, setState] = useState({ options: {} });

  const {
    contentTypes,
    onChange,
    disabled,
    value,
    modifiedContentTypes
  } = props;

  const filterOptions = (options) => {
    const newOptions = {};

    // Remove the contentypes which are allready set in the sitemap.
    Object.entries(options).map(([i, e]) => {
      if (!modifiedContentTypes[i]) {
        newOptions[i] = e;
      }
    });

    return newOptions;
  }

  const buildOptions = () => {
    let options = {};

    options['- Choose Content Type -'] = false;

    contentTypes.map(contentType => {
      let uidFieldName = false;

      Object.entries(contentType.schema.attributes).map(([i, e]) => {
        if (e.type === "uid") {
          uidFieldName = i;
        }
      })
      
      if (uidFieldName) {
        options[contentType.apiID] = uidFieldName;
      }
    })

    return filterOptions(options);
  }

  useEffect(() => {
    setState(prevState => ({ 
      ...prevState, 
      options: edit ? { [edit]: false } : buildOptions()
    }));
  }, [])

  return (
    <React.Fragment>
      <Label htmlFor="select" message="Content Type" />
      <Select
        name="select"
        label="test"
        onChange={(e) => onChange(e, state.options[e.target.value])}
        options={Object.keys(state.options)}
        value={!isEmpty(edit) ? edit : value}
        disabled={disabled}
      />
      <p style={{ color: '#9ea7b8', fontSize: 12, marginTop: 5, marginBottom: 20 }}>Select a content type.</p>
    </React.Fragment>
  );
}
 
export default SelectContentTypes;