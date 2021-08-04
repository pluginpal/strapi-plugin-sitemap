import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const { formatMessage } = useGlobalContext();

  // Loading state
  if (!state.getIn(['settings', 'contentTypes'])) {
    return null;
  }

  return (
    <div>
      <List 
        items={state.getIn(['settings', 'contentTypes'])}
        title={formatMessage({ id: `sitemap.Settings.CollectionTitle` })}
        subtitle={formatMessage({ id: `sitemap.Settings.CollectionDescription` })}
        openModal={() => setModalOpen(true)}
        onDelete={(key) => dispatch(deleteContentType(key))}
      />
      <Wrapper>
        <Button 
          color="primary" 
          icon={<FontAwesomeIcon icon={faPlus} />} 
          label={formatMessage({ id: 'sitemap.Button.AddAll' })}
          onClick={() => dispatch(populateSettings())}
          hidden={state.getIn(['settings', 'contentTypes']).size}
        />
        <Button 
          color="secondary"
          style={{ marginLeft: 15 }}
          icon={<FontAwesomeIcon icon={faPlus} />} 
          label={formatMessage({ id: 'sitemap.Button.Add1by1' })}
          onClick={() => props.history.push({ search: 'addNew' })}
          hidden={state.getIn(['settings', 'contentTypes']).size}
        />
      </Wrapper>
      <ModalForm 
        contentTypes={state.get('contentTypes')}
        modifiedContentTypes={state.get('modifiedContentTypes')}
        modifiedCustomEntries={state.get('modifiedCustomEntries')}
        settingsType={'Collection'}
        isOpen={modalOpen}
        onSubmit={(e) => handleModalSubmit(e)}
        onCancel={() => dispatch(discardModifiedContentTypes())}
        onChange={(e, contentType, settingsType) => dispatch(onChangeContentTypes(e, contentType, settingsType))}
      />
    </div>
  );
}
 
export default CollectionURLs;