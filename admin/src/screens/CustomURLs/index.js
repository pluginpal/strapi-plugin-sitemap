import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGlobalContext } from 'strapi-helper-plugin';
import { Button } from '@buffetjs/core';
import { Map } from 'immutable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { deleteContentType, discardModifiedContentTypes, onChangeContentTypes, populateSettings, submitModal, deleteCustomEntry } from '../../state/actions/Sitemap';
import List from '../../components/List';
import ModalForm from '../../components/ModalForm';
import Wrapper from '../../components/Wrapper';

const CustomURLs = () => {
  const state = useSelector((state) => state.get('sitemap', Map()));
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const { formatMessage } = useGlobalContext();

  const handleModalSubmit = (e) => {
    e.preventDefault();
    return dispatch(submitModal());
  }

  // Loading state
  if (!state.getIn(['settings', 'customEntries'])) {
    return null
  }

  return (
    <div>
      <List 
        items={state.getIn(['settings', 'customEntries'])}
        title={formatMessage({ id: `sitemap.Settings.CustomTitle` })}
        subtitle={formatMessage({ id: `sitemap.Settings.CustomDescription` })}
        openModal={() => setModalOpen(true)}
        onDelete={(key) => dispatch(deleteCustomEntry(key))}
        prependSlash
      />
      <Wrapper>
        <Button 
          color="primary" 
          icon={<FontAwesomeIcon icon={faPlus} />} 
          label={formatMessage({ id: 'sitemap.Button.AddURL' })}
          onClick={() => setModalOpen(!modalOpen)}
          hidden={state.getIn(['settings', 'customEntries']).size}
        />
      </Wrapper>
      <ModalForm
        contentTypes={state.get('contentTypes')}
        modifiedContentTypes={state.get('modifiedContentTypes')}
        modifiedCustomEntries={state.get('modifiedCustomEntries')}
        settingsType={'Custom'}
        isOpen={modalOpen}
        onSubmit={(e) => {
          handleModalSubmit(e);
          setModalOpen(false);
        }}
        onCancel={() => {
          dispatch(discardModifiedContentTypes());
          setModalOpen(false);
        }}
        onChange={(e, contentType, settingsType) => dispatch(onChangeContentTypes(e, contentType, settingsType))}
      />
    </div>
  );
}
 
export default CustomURLs;