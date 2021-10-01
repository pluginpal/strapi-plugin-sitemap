import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Map } from 'immutable';

import { deleteContentType, discardModifiedContentTypes, onChangeContentTypes, submitModal } from '../../state/actions/Sitemap';
import List from '../../components/List';
import ModalForm from '../../components/ModalForm';

const CollectionURLs = () => {
  const state = useSelector((store) => store.get('sitemap', Map()));
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [uid, setUid] = useState(null);

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
        openModal={(editId) => handleModalOpen(editId)}
        onDelete={(key) => dispatch(deleteContentType(key))}
      />
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
