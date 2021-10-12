import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Map } from 'immutable';

import { deleteContentType, discardModifiedContentTypes, onChangeContentTypes, submitModal } from '../../state/actions/Sitemap';
import List from '../../components/List/Collection';
import ModalForm from '../../components/ModalForm';

const CollectionURLs = () => {
  const state = useSelector((store) => store.get('sitemap', Map()));
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [uid, setUid] = useState(null);
  const [langcode, setLangcode] = useState('und');

  const handleModalSubmit = (e) => {
    e.preventDefault();
    dispatch(submitModal());
    setModalOpen(false);
    setUid(null);
  };

  const handleModalOpen = (editId, lang) => {
    if (editId) setUid(editId);
    if (lang) setLangcode(lang);
    setModalOpen(true);
  };

  const handleModalClose = (closeModal = true) => {
    if (closeModal) {
      setModalOpen(false);
      setUid(null);
    }
    dispatch(discardModifiedContentTypes());
  };

  // Loading state
  if (!state.getIn(['settings', 'contentTypes'])) {
    return null;
  }

  return (
    <div>
      <List
        items={state.getIn(['settings', 'contentTypes'])}
        openModal={(editId, lang) => handleModalOpen(editId, lang)}
        onDelete={(key, lang) => dispatch(deleteContentType(key, lang))}
      />
      <ModalForm
        contentTypes={state.get('contentTypes')}
        allowedFields={state.get('allowedFields')}
        modifiedState={state.get('modifiedContentTypes')}
        onSubmit={(e) => handleModalSubmit(e)}
        onCancel={(closeModal) => handleModalClose(closeModal)}
        onChange={(contentType, lang, key, value) => dispatch(onChangeContentTypes(contentType, lang, key, value))}
        isOpen={modalOpen}
        id={uid}
        lang={langcode}
        type="collection"
      />
    </div>
  );
};

export default CollectionURLs;
