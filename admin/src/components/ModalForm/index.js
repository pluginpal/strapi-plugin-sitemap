import React, { useState, useEffect } from 'react';

import { Button, AttributeIcon } from '@buffetjs/core';

import {
  HeaderModal,
  HeaderModalTitle,
  Modal,
  ModalBody,
  ModalFooter,
  useGlobalContext,
  request,
} from 'strapi-helper-plugin';

import CustomForm from './Custom';
import CollectionForm from './Collection';

const ModalForm = (props) => {
  const [uid, setUid] = useState('');
  const [patternInvalid, setPatternInvalid] = useState({ invalid: false });
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
    setPatternInvalid({ invalid: false });

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
    if (type === 'collection') {
      const response = await request('/sitemap/pattern/validate-pattern', {
        method: 'POST',
        body: {
          pattern: modifiedState.getIn([uid, 'pattern'], null),
          modelName: uid,
        },
      });

      if (!response.valid) {
        setPatternInvalid({ invalid: true, message: response.message });
      } else onSubmit(e);
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
