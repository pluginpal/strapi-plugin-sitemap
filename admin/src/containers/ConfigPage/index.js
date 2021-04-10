import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGlobalContext, HeaderNav } from 'strapi-helper-plugin';
import { isEmpty } from 'lodash';
import { Button } from '@buffetjs/core';
import { Map } from 'immutable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { deleteContentType, discardModifiedContentTypes, getContentTypes, getSettings, hasSitemap, onChangeContentTypes, onChangeSettings, populateSettings, submit, submitModal } from '../../state/actions/Sitemap';
import pluginId from '../../helpers/pluginId';
import Header from '../../components/Header';
import List from '../../components/List';
import ModalForm from '../../components/ModalForm';
import SettingsForm from '../../components/SettingsForm';
import Wrapper from '../../components/Wrapper';
import { ContainerFluid } from './components';

const ConfigPage = (props) => {
  const { formatMessage } = useGlobalContext();
  const [settingsType, setSettingsType] = useState('');
  const dispatch = useDispatch();
  const state = useSelector((state) => state.get('sitemap', Map()));

  useEffect(() => {
    dispatch(getSettings());
    dispatch(getContentTypes());
    dispatch(hasSitemap());
    setSettingsType(getSettingsType());
  }, []);

  const getSettingsType = () => {
    const settingsUrl = props.match.path.split("/").pop();
    const settingsType =
      settingsUrl === 'collection-entries' ? 'Collection' :
      settingsUrl === 'custom-entries' && 'Custom';

    return settingsType;
  }

  const handleModalSubmit = (e) => {
    e.preventDefault();
    dispatch(submitModal());
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submit(state.get('settings').toJS()));
  }

  // if (isEmpty(dispatch(contentTypes)) ){
  //   return (<div />);
  // }

  return (
    <div>
      <ContainerFluid>
        <Header 
          onSubmit={(e) => handleSubmit(e)}
          onCancel={() => dispatch(discardAllChanges())}
          settings={state.get('settings')}
          initialData={state.get('initialData')}
          generateSitemap={() => dispatch(generateSitemap())}
          sitemapPresence={state.get('sitemapPresence')}
        />
        <HeaderNav
          links={[
            {
              name: 'Collection entries',
              to: `/plugins/${pluginId}/collection-entries`,
            },
            {
              name: 'Custom entries',
              to: `/plugins/${pluginId}/custom-entries`,
            },
          ]}
          style={{ marginTop: '4.6rem' }}
        />
        <List 
          settingsType={settingsType}
          settings={state.get('settings')}
          onDelete={(contentType, settingsType) => dispatch(deleteContentType(contentType, settingsType))}
        />
        <Wrapper style={{ paddingTop: 0, paddingBottom: 0, marginBottom: 0 }}>
          <Button 
            color="primary" 
            icon={<FontAwesomeIcon icon={faPlus} />} 
            label={formatMessage({ id: 'sitemap.Button.AddAll' })}
            onClick={() => dispatch(populateSettings())}
            hidden={settingsType === 'Custom' || !state.getIn(['settings', 'contentTypes'], null)}
          />
          <Button 
            color="primary" 
            icon={<FontAwesomeIcon icon={faPlus} />} 
            label={formatMessage({ id: 'sitemap.Button.AddURL' })}
            onClick={() => props.history.push({ search: 'addNew' })}
            hidden={settingsType === 'Collection' || !state.getIn(['settings', 'customEntries'], null)}
          />
          <Button 
            color="secondary"
            style={{ marginLeft: 15 }}
            icon={<FontAwesomeIcon icon={faPlus} />} 
            label={formatMessage({ id: 'sitemap.Button.Add1by1' })}
            onClick={() => props.history.push({ search: 'addNew' })}
            hidden={settingsType === 'Custom' || !state.getIn(['settings', 'contentTypes'], null)}
          />
        </Wrapper>
        <ModalForm 
          contentTypes={state.get('contentTypes')}
          modifiedContentTypes={state.get('modifiedContentTypes')}
          modifiedCustomEntries={state.get('modifiedCustomEntries')}
          settingsType={settingsType}
          onSubmit={(e) => handleModalSubmit(e)}
          onCancel={() => dispatch(discardModifiedContentTypes())}
          onChange={(e, contentType, settingsType) => dispatch(onChangeContentTypes(e, contentType, settingsType))}
        />
        <SettingsForm 
          onChange={(e, key) => dispatch(onChangeSettings(e, key))} 
        />
      </ContainerFluid>
    </div>
  );
}
 
export default ConfigPage;