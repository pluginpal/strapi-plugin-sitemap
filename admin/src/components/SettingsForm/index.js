import React from 'react';
import Wrapper from '../Wrapper';
import { InputText, Label, Toggle } from '@buffetjs/core';
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
        <div style={{ marginTop: 20 }}>
          <Label 
            htmlFor="includeHomepage" 
            message={globalContext.formatMessage({ id: 'sitemap.Settings.Field.IncludeHomepage.Label' })}
          />
          <Toggle
            name="toggle"
            onChange={(e) => onChange(e, 'includeHomepage')}
            value={get(props.settings, 'includeHomepage', false)}
          />
          <p style={{ color: '#9ea7b8', fontSize: 12, marginTop: 5 }}>
            {globalContext.formatMessage({ id: 'sitemap.Settings.Field.IncludeHomepage.Description' })}
          </p>
        </div>
        <div style={{ marginTop: 20 }}>
        <Label 
          htmlFor="excludeDrafts" 
          message={globalContext.formatMessage({ id: 'sitemap.Settings.Field.ExcludeDrafts.Label' })}
        />
        <Toggle
          name="toggle"
          onChange={(e) => onChange(e, 'excludeDrafts')}
          value={get(props.settings, 'excludeDrafts', false)}
        />
        <p style={{ color: '#9ea7b8', fontSize: 12, marginTop: 5 }}>
          {globalContext.formatMessage({ id: 'sitemap.Settings.Field.ExcludeDrafts.Description' })}
        </p>
      </div>
        </div>
    </Wrapper>
  );
}
 
export default SettingsForm;