import React from 'react';
import Wrapper from '../Wrapper';
import { InputText, Label } from '@buffetjs/core';
import { get } from 'lodash';
import { useGlobalContext } from 'strapi-helper-plugin';

const SettingsForm = (props) => {
  const { onChange } = props;
  const globalContext = useGlobalContext();

  return (
    <Wrapper style={{ zIndex: 1, position: 'relative' }}>
      <div style={{ borderTop: '1px solid #f5f5f6', paddingTop: 30 }}>
        <div style={{ maxWidth: 500 }}>
          <Label 
            htmlFor="hostname" 
            message={globalContext.formatMessage({ id: 'sitemap.Settings.Field.Hostname.Label' })}
          />
          <InputText
            name="hostname"
            onChange={(e) => onChange(e, 'hostname')}
            placeholder="https://www.strapi.io"
            type="text"
            value={get(props.settings, 'hostname', '')}
          />
          <p style={{ color: '#9ea7b8', fontSize: 12, marginTop: 5 }}>
            {globalContext.formatMessage({ id: 'sitemap.Settings.Field.Hostname.Description' })}
          </p>
        </div>
      </div>
    </Wrapper>
  );
}
 
export default SettingsForm;