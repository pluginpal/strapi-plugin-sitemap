import React from 'react';

import { InputText, Label } from '@buffetjs/core';
import { useGlobalContext } from 'strapi-helper-plugin';

const inputUID = (props) => {
  const globalContext = useGlobalContext();

  return (
    <div>
      <Label 
        htmlFor="url" 
        message={globalContext.formatMessage({ id: 'sitemap.Settings.Field.InputUID.Label' })}
      />
      <InputText 
        type="text"
        name="url"
        {...props}
      />
      <p style={{ color: '#9ea7b8', fontSize: 12, marginTop: 5 }}>
        {globalContext.formatMessage({ id: 'sitemap.Settings.Field.InputUID.Description' })}
      </p>
    </div>
  );
}
 
export default inputUID;