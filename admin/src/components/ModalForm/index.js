import React, { useState, useEffect } from 'react';

import { Button, AttributeIcon } from '@buffetjs/core';
import { useGlobalContext } from 'strapi-helper-plugin';

import {
  HeaderModal,
  HeaderModalTitle,
  Modal,
  ModalBody,
  ModalFooter
} from 'strapi-helper-plugin';

import CustomForm from './Custom';
import CollectionForm from './Collection';

const ModalForm = (props) => {
  const [uid, setUid] = useState('');
  const globalContext = useGlobalContext();

  const {
    onSubmit,
    onCancel,
    isOpen,
    id,
    type,
  } = props;

  useEffect(() => {
    if (id && !uid) {
      setUid(id);
    } else {
      setUid('');
    }
  }, [isOpen]);

  // Styles
  const modalBodyStyle = {
    paddingTop: '0.5rem', 
    paddingBottom: '3rem'
  };

  const form = () => {
    switch (type) {
      case 'collection':
        return <CollectionForm uid={uid} setUid={setUid} {...props} />;
      case 'custom':
        return <CustomForm uid={uid} setUid={setUid} {...props} />;
      default:
        return;
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClosed={() => onCancel()}
      onToggle={() => onCancel()}
      withoverflow={'displayName'}
    >
      <HeaderModal>
        <section style={{ alignItems: 'center' }}>
          <AttributeIcon type='enum' />
          <HeaderModalTitle style={{ marginLeft: 15 }}>{globalContext.formatMessage({ id: 'sitemap.Modal.HeaderTitle' })} - {type}</HeaderModalTitle>
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
            onClick={(e) => onSubmit(e)}
          >
            {globalContext.formatMessage({ id: 'sitemap.Button.Save' })}
          </Button>
        </section>
      </ModalFooter>
    </Modal>
  );
}
 
export default ModalForm;