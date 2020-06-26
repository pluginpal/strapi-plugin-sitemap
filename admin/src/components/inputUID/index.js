import React from 'react';

import { InputText, Label } from '@buffetjs/core';
import { useGlobalContext } from 'strapi-helper-plugin';

const inputUID = ({ name, label, description, ...props }) => {
  const globalContext = useGlobalContext();

  return (
    <div>
      <Label 
        htmlFor={name}
        message={label}
      />
      <InputText 
        type="text"
        name={name}
        {...props}
      />
      <p style={{ color: '#9ea7b8', fontSize: 12, marginTop: 5 }}>
        { description }
      </p>
    </div>
  );
}
 
export default inputUID;