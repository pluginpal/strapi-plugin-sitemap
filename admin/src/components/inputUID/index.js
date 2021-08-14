import React from 'react';

import { InputText, Label } from '@buffetjs/core';

const inputUID = ({ name, label, description, error, invalid, ...props }) => {

  return (
    <div>
      <Label
        htmlFor={name}
        message={label}
      />
      <InputText
        type="text"
        name={name}
        style={{ borderColor: invalid && 'red' }}
        {...props}
      />
      {invalid && (
        <p style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
          { error }
        </p>
      )}
      <p style={{ color: '#9ea7b8', fontSize: 12, marginTop: 5 }}>
        { description }
      </p>
    </div>
  );
};

export default inputUID;
