import React, { useState, useEffect } from 'react';

import { Inputs } from '@buffetjs/custom';
import { Button, AttributeIcon } from '@buffetjs/core';
import { useGlobalContext } from 'strapi-helper-plugin';

import {
  HeaderModal,
  HeaderModalTitle,
  Modal,
  ModalBody,
  ModalFooter
} from 'strapi-helper-plugin';

import form from './mapper';
import InputUID from '../inputUID';

const ModalForm = (props) => {
  const [uid, setUid] = useState('');
  const globalContext = useGlobalContext();

  const {
    onSubmit,
    onChange,
    onCancel,
    isOpen,
    modifiedState,
    id
  } = props;

  useEffect(() => {
    if (id && !uid) {
      setUid(id);
    } else {
      setUid('');
    }
  }, [isOpen])

  const handleCustomChange = (e) => {
    let contentType = e.target.value; 

    if (contentType.match(/^[A-Za-z0-9-_.~/]*$/)) {
      setUid(contentType);
    } else {
      contentType = uid;
    }

    // Set initial values
    onCancel(false);
    Object.keys(form).map(input => {
      onChange(contentType, input, form[input].value);
    });
  }

  // Styles
  const modalBodyStyle = {
    paddingTop: '0.5rem', 
    paddingBottom: '3rem'
  };

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
          <HeaderModalTitle style={{ marginLeft: 15 }}>{globalContext.formatMessage({ id: 'sitemap.Modal.HeaderTitle' })} - Custom</HeaderModalTitle>
        </section>
      </HeaderModal>
      <ModalBody style={modalBodyStyle}>
        <div className="container-fluid">
        <section style={{ marginTop: 20 }}>
          <h2><strong>{globalContext.formatMessage({ id: 'sitemap.Modal.Title' })}</strong></h2>
          { !id &&
            <p style={{ maxWidth: 500 }}>{globalContext.formatMessage({ id: `sitemap.Modal.CustomDescription` })}</p>
          }
          <form className="row" style={{ borderTop: '1px solid #f5f5f6', paddingTop: 30, marginTop: 10 }}>
            <div className="col-md-6">
              <InputUID
                onChange={(e) => handleCustomChange(e)}
                value={uid}
                label={globalContext.formatMessage({ id: 'sitemap.Settings.Field.URL.Label' })}
                description={globalContext.formatMessage({ id: 'sitemap.Settings.Field.URL.Description' })}
                name="url"
                disabled={id}
              />
            </div>
            <div className="col-md-6">
              <div className="row">
                {Object.keys(form).map(input => {
                  return (
                  <div className={form[input].styleName} key={input}>
                    <Inputs
                      name={input}
                      disabled={!uid}
                      {...form[input]}
                      onChange={(e) => onChange(uid, e.target.name, e.target.value)}
                      value={modifiedState.getIn([uid, input], form[input].value)}
                    />
                  </div>
                )})}
              </div>
            </div>
          </form>
        </section>
        </div>
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