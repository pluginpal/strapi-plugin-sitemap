import React from 'react';
import { useSelector } from 'react-redux';
import { useGlobalContext } from 'strapi-helper-plugin';
import { Button } from '@buffetjs/core';
import { Map } from 'immutable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { deleteContentType, discardModifiedContentTypes, onChangeContentTypes, populateSettings } from '../../state/actions/Sitemap';
import List from '../../components/List';
import ModalForm from '../../components/ModalForm';
import Wrapper from '../../components/Wrapper';

const CollectionURLs = () => {
  const state = useSelector((state) => state.get('sitemap', Map()));
  const { formatMessage } = useGlobalContext();

  return (
    <div>
      <List 
        settingsType={'Collection'}
        settings={state.get('settings')}
        onDelete={(contentType, settingsType) => dispatch(deleteContentType(contentType, settingsType))}
      />
      <Wrapper>
        <Button 
          color="primary" 
          icon={<FontAwesomeIcon icon={faPlus} />} 
          label={formatMessage({ id: 'sitemap.Button.AddAll' })}
          onClick={() => dispatch(populateSettings())}
          hidden={!state.getIn(['settings', 'contentTypes'], null)}
        />
        <Button 
          color="primary" 
          icon={<FontAwesomeIcon icon={faPlus} />} 
          label={formatMessage({ id: 'sitemap.Button.AddURL' })}
          onClick={() => props.history.push({ search: 'addNew' })}
          hidden={!state.getIn(['settings', 'customEntries'], null)}
        />
        <Button 
          color="secondary"
          style={{ marginLeft: 15 }}
          icon={<FontAwesomeIcon icon={faPlus} />} 
          label={formatMessage({ id: 'sitemap.Button.Add1by1' })}
          onClick={() => props.history.push({ search: 'addNew' })}
          hidden={!state.getIn(['settings', 'contentTypes'], null)}
        />
      </Wrapper>
      <ModalForm 
        contentTypes={state.get('contentTypes')}
        modifiedContentTypes={state.get('modifiedContentTypes')}
        modifiedCustomEntries={state.get('modifiedCustomEntries')}
        settingsType={'Collection'}
        onSubmit={(e) => handleModalSubmit(e)}
        onCancel={() => dispatch(discardModifiedContentTypes())}
        onChange={(e, contentType, settingsType) => dispatch(onChangeContentTypes(e, contentType, settingsType))}
      />
    </div>
  );
}
 
export default CollectionURLs;