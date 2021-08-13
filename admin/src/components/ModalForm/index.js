import React, { useState, useEffect } from 'react';

import { Button, AttributeIcon } from '@buffetjs/core';

import {
  HeaderModal,
  HeaderModalTitle,
  Modal,
  ModalBody,
  ModalFooter,
  useGlobalContext,
} from 'strapi-helper-plugin';

import CustomForm from './Custom';
import CollectionForm from './Collection';

const ModalForm = (props) => {
  const [uid, setUid] = useState('');
  const [patternInvalid, setPatternInvalid] = useState(false);
  const globalContext = useGlobalContext();

  const {
    onSubmit,
    onCancel,
    isOpen,
    id,
    type,
    modifiedState,
  } = props;

  useEffect(() => {
    setPatternInvalid(false);

    if (id && !uid) {
      setUid(id);
    } else {
      setUid('');
    }
  }, [isOpen]);

  // Styles
  const modalBodyStyle = {
    paddingTop: '0.5rem',
    paddingBottom: '3rem',
    position: 'relative',
  };

  const submitForm = async (e) => {
    if (type === 'collection' && (!modifiedState.getIn([uid, 'pattern'], null) || patternInvalid)) {
      setPatternInvalid(true);
    } else onSubmit(e);
  };

  const form = () => {
    switch (type) {
      case 'collection':
        return <CollectionForm uid={uid} setUid={setUid} setPatternInvalid={setPatternInvalid} patternInvalid={patternInvalid} {...props} />;
      case 'custom':
        return <CustomForm uid={uid} setUid={setUid} {...props} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClosed={() => onCancel()}
      onToggle={() => onCancel()}
      withoverflow="displayName"
    >
      <HeaderModal>
        <section style={{ alignItems: 'center' }}>
          <AttributeIcon type="enum" />
          <HeaderModalTitle style={{ marginLeft: 15 }}>
            {globalContext.formatMessage({ id: 'sitemap.Modal.HeaderTitle' })} - {type}
          </HeaderModalTitle>
        </section>
      </HeaderModal>
      <ModalBody style={modalBodyStyle}>
        {form()}
      </ModalBody>
      <ModalFooter>
        <section style={{ alignItems: 'center' }}>
          <Button
            color="cancel"
            onClick={() => onCancel()}
          >
            {globalContext.formatMessage({ id: 'sitemap.Button.Cancel' })}
          </Button>
          <Button
            color="primary"
            style={{ marginLeft: 'auto' }}
            disabled={!uid}
            onClick={submitForm}
          >
            {globalContext.formatMessage({ id: 'sitemap.Button.Save' })}
          </Button>
        </section>
      </ModalFooter>
    </Modal>
  );
};

export default ModalForm;
