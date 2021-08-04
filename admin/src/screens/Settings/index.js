import React from 'react';
import { Map } from 'immutable';
import { useDispatch, useSelector } from 'react-redux';
import { InputText, Label, Toggle } from '@buffetjs/core';
import { useGlobalContext } from 'strapi-helper-plugin';

import { onChangeSettings } from '../../state/actions/Sitemap';
import Wrapper from '../../components/Wrapper';

const Settings = () => {
  const { formatMessage } = useGlobalContext();
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.getIn(['sitemap', 'settings'], Map()));

  return (
    <Wrapper>
      <div style={{ maxWidth: 500 }}>
        <Label 
          htmlFor="hostname" 
          message={formatMessage({ id: 'sitemap.Settings.Field.Hostname.Label' })}
        />
        <InputText
          name="hostname"
          onChange={(e) => dispatch(onChangeSettings('hostname', e.target.value))}
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
          onChange={(e) => dispatch(onChangeSettings('includeHomepage', e.target.value))}
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
          onChange={(e) => dispatch(onChangeSettings('excludeDrafts', e.target.value))}
          value={settings.get('excludeDrafts')}
        />
        <p style={{ color: '#9ea7b8', fontSize: 12, marginTop: 5 }}>
          {formatMessage({ id: 'sitemap.Settings.Field.ExcludeDrafts.Description' })}
        </p>
      </div>
    </Wrapper>
  );
}
 
export default Settings;