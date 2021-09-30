import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { Button } from '@buffetjs/core';
import { Map } from 'immutable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { deleteContentType, discardModifiedContentTypes, onChangeContentTypes, submitModal } from '../../state/actions/Sitemap';
import List from '../../components/List';
import ModalForm from '../../components/ModalForm';
import Wrapper from '../../components/Wrapper';

const CollectionURLs = () => {
  const state = useSelector((store) => store.get('sitemap', Map()));
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [uid, setUid] = useState(null);
  const { formatMessage } = useIntl();

  const handleModalSubmit = (e) => {
    e.preventDefault();
    dispatch(submitModal());
    setModalOpen(false);
    setUid(null);
  };

  const handleModalOpen = (editId) => {
    if (editId) setUid(editId);
    setModalOpen(true);
  };

  const handleModalClose = (closeModal = true) => {
    if (closeModal) setModalOpen(false);
    dispatch(discardModifiedContentTypes());
    setUid(null);
  };

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
        openModal={(editId) => handleModalOpen(editId)}
        onDelete={(key) => dispatch(deleteContentType(key))}
      />
      <Wrapper>
        <Button
          color="secondary"
          icon={<FontAwesomeIcon icon={faPlus} />}
          label={formatMessage({ id: 'sitemap.Button.Add' })}
          onClick={() => setModalOpen(!modalOpen)}
          hidden={state.getIn(['settings', 'contentTypes']).size}
        />
      </Wrapper>
      <ModalForm
        contentTypes={state.get('contentTypes')}
        modifiedState={state.get('modifiedContentTypes')}
        onSubmit={(e) => handleModalSubmit(e)}
        onCancel={(closeModal) => handleModalClose(closeModal)}
        onChange={(contentType, key, value) => dispatch(onChangeContentTypes(contentType, key, value))}
        isOpen={modalOpen}
        id={uid}
        type="collection"
      />
    </div>
  );
};

export default CollectionURLs;
