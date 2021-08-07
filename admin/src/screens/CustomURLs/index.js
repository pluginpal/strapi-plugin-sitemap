import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGlobalContext } from 'strapi-helper-plugin';
import { Button } from '@buffetjs/core';
import { Map } from 'immutable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { deleteContentType, discardModifiedContentTypes, onChangeCustomEntry, populateSettings, submitModal, deleteCustomEntry } from '../../state/actions/Sitemap';
import List from '../../components/List';
import ModalForm from '../../components/ModalForm';
import Wrapper from '../../components/Wrapper';

const CustomURLs = () => {
  const state = useSelector((state) => state.get('sitemap', Map()));
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [uid, setUid] = useState(null);
  const { formatMessage } = useGlobalContext();

  const handleModalSubmit = (e) => {
    e.preventDefault();
    dispatch(submitModal());
    setModalOpen(false);
    setUid(null);
  }

  const handleModalOpen = (uid) => {
    if (uid) setUid(uid);
    setModalOpen(true);
  };

  const handleModalClose = (closeModal = true) => {
    if (closeModal) setModalOpen(false);
    dispatch(discardModifiedContentTypes());
    setUid(null);
  };

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
        openModal={(uid) => handleModalOpen(uid)}
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
        modifiedState={state.get('modifiedCustomEntries')}
        isOpen={modalOpen}
        id={uid}
        onSubmit={(e) => handleModalSubmit(e)}
        onCancel={(closeModal) => handleModalClose(closeModal)}
        onChange={(url, key, value) => dispatch(onChangeCustomEntry(url, key, value))}
        type="custom"
      />
    </div>
  );
}
 
export default CustomURLs;