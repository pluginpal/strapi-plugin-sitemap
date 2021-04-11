import React from 'react';
import { useDispatch } from 'react-redux';
import SettingsForm from '../../components/SettingsForm';
import { onChangeSettings } from '../../state/actions/Sitemap';
import Wrapper from '../../components/Wrapper';

const Settings = () => {
  const dispatch = useDispatch();

  return (
    <Wrapper>
      <SettingsForm
        onChange={(e, key) => dispatch(onChangeSettings(e, key))} 
      />
    </Wrapper>
  );
}
 
export default Settings;