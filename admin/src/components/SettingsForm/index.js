import React from 'react';
import Wrapper from '../Wrapper';
import { InputText, Label, Toggle } from '@buffetjs/core';
import { Map } from 'immutable';
import { useGlobalContext } from 'strapi-helper-plugin';
import { useSelector } from 'react-redux';

const SettingsForm = ({ onChange }) => {
  const { formatMessage } = useGlobalContext();
  const settings = useSelector((state) => state.getIn(['sitemap', 'settings']), Map());

  return (
    <Wrapper style={{ zIndex: 1, position: 'relative' }}>
      <div style={{ borderTop: '1px solid #f5f5f6', paddingTop: 30 }}>
        <div style={{ maxWidth: 500 }}>
          <Label 
            htmlFor="hostname" 
            message={formatMessage({ id: 'sitemap.Settings.Field.Hostname.Label' })}
          />
          <InputText
            name="hostname"
            onChange={(e) => onChange(e, 'hostname')}
            placeholder="https://www.strapi.io"
            type="text"
            value={settings.get('hostname')}
          />
          <p style={{ color: '#9ea7b8', fontSize: 12, marginTop: 5 }}>
            {formatMessage({ id: 'sitemap.Settings.Field.Hostname.Description' })}
          </p>
        </div>
        <div style={{ marginTop: 20 }}>
          <Label 
            htmlFor="includeHomepage" 
            message={formatMessage({ id: 'sitemap.Settings.Field.IncludeHomepage.Label' })}
          />
          <Toggle
            name="toggle"
            onChange={(e) => onChange(e, 'includeHomepage')}
            value={settings.get('includeHomepage')}
          />
          <p style={{ color: '#9ea7b8', fontSize: 12, marginTop: 5 }}>
            {formatMessage({ id: 'sitemap.Settings.Field.IncludeHomepage.Description' })}
          </p>
        </div>
        <div style={{ marginTop: 20 }}>
        <Label 
          htmlFor="excludeDrafts" 
          message={formatMessage({ id: 'sitemap.Settings.Field.ExcludeDrafts.Label' })}
        />
        <Toggle
          name="toggle"
          onChange={(e) => onChange(e, 'excludeDrafts')}
          value={settings.get('excludeDrafts')}
        />
        <p style={{ color: '#9ea7b8', fontSize: 12, marginTop: 5 }}>
          {formatMessage({ id: 'sitemap.Settings.Field.ExcludeDrafts.Description' })}
        </p>
      </div>
        </div>
    </Wrapper>
  );
}
 
export default SettingsForm;