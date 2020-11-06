import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { get, has, isEmpty } from 'lodash';

import { Inputs } from '@buffetjs/custom';
import { Select, Label } from '@buffetjs/core';
import { Button, AttributeIcon } from '@buffetjs/core';
import { useGlobalContext } from 'strapi-helper-plugin';
import SelectContentTypes from '../SelectContentTypes';

import {
  HeaderModal,
  HeaderModalTitle,
  Modal,
  ModalBody,
  ModalFooter
} from 'strapi-helper-plugin';

import form from './mapper';
import InputUID from '../inputUID';
import { getUidFieldsByContentType } from '../../utils/getUidfields';

const ModalForm = (props) => {
  const { search, edit } = useLocation();
  const { push } = useHistory();
  const [state, setState] = useState({});
  const isOpen = !isEmpty(search) || !isEmpty(edit);
  const globalContext = useGlobalContext();

  const {
    onSubmit,
    contentTypes,
    onChange,
    onCancel,
    settingsType
  } = props;

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      contentType: '',
      area: '',
      uidFields: [],
      selectedUidField: '',
    }));
  }, [])


  const handleSelectChange = (e, uidFields) => {
    const contentType = e.target.value; 
    setState(prevState => ({ ...prevState, contentType }));

    // Set initial values
    onCancel();
    Object.keys(form).map(input => {
      onChange({target: form[input]}, contentType, settingsType)
    });

    if (uidFields.length === 1) {
      setState(prevState => ({ ...prevState, uidFields: [], selectedUidField: '' }));
      onChange({target: { name: 'uidField', value: uidFields[0]}}, contentType, settingsType)
    }
    if (uidFields.length > 1) {
      setState(prevState => ({ ...prevState, uidFields }));
      // onChange({target: { name: 'uidField', value: uidFields[0]}}, contentType, settingsType)
    }

    onChange({target: { name: 'area', value: ''}}, contentType, settingsType)
  }

  const handleCustomChange = (e) => {
    let contentType = e.target.value; 

    if (contentType.match(/^[A-Za-z0-9-_.~/]*$/)) {
      setState(prevState => ({ ...prevState, contentType }));
    } else {
      contentType = state.contentType;
    }

    // Set initial values
    onCancel();
    Object.keys(form).map(input => {
      onChange({target: form[input]}, contentType, settingsType)
    });
  }

  const getValue = (input) => {
    const subKey = settingsType === 'Collection' ? 'modifiedContentTypes' : 'modifiedCustomEntries';

    if (has(props[subKey], [contentType, input], '')) {
      return get(props[subKey], [contentType, input], '');
    } else {
      return form[input].value;
    }
  };

  // Styles
  const modalBodyStyle = {
    paddingTop: '0.5rem', 
    paddingBottom: '3rem'
  };

  let { contentType, area, uidFields } = state;
  if (!isEmpty(edit)) { 
    contentType = edit;
    uidFields = getUidFieldsByContentType(contentTypes.filter((mappedContentType) => mappedContentType.apiID === edit)[0]);
    if (uidFields.length <= 1) uidFields = [];
    if (settingsType === 'collection') area = getValue('area');
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpened={() => {}}
      onClosed={() => {
        onCancel();
        setState(prevState => ({ ...prevState, contentType: '' , uidFields: [] }));
      }}
      onToggle={() => push({search: ''})}
      withoverflow={'displayName'}
    >
      <HeaderModal>
        <section style={{ alignItems: 'center' }}>
          <AttributeIcon type='enum' />
          <HeaderModalTitle style={{ marginLeft: 15 }}>{globalContext.formatMessage({ id: 'sitemap.Modal.HeaderTitle' })} - {settingsType}</HeaderModalTitle>
        </section>
      </HeaderModal>
      <ModalBody style={modalBodyStyle}>
        <div className="container-fluid">
        <section style={{ marginTop: 20 }}>
          <h2><strong>{globalContext.formatMessage({ id: 'sitemap.Modal.Title' })}</strong></h2>
          { isEmpty(edit) &&
            <p style={{ maxWidth: 500 }}>{settingsType && globalContext.formatMessage({ id: `sitemap.Modal.${settingsType}Description` })}</p>
          }
          <form className="row" style={{ borderTop: '1px solid #f5f5f6', paddingTop: 30, marginTop: 10 }}>
            <div className="col-md-6">
              { settingsType === 'Collection' ?
                <SelectContentTypes 
                  contentTypes={contentTypes} 
                  onChange={(e, uidFields) => handleSelectChange(e, uidFields)}
                  value={contentType}
                  disabled={!isEmpty(edit)}
                  modifiedContentTypes={props.modifiedContentTypes}
                /> :
                <InputUID
                  onChange={(e) => handleCustomChange(e)}
                  value={contentType}
                  label={globalContext.formatMessage({ id: 'sitemap.Settings.Field.URL.Label' })}
                  description={globalContext.formatMessage({ id: 'sitemap.Settings.Field.URL.Description' })}
                  name="url"
                  disabled={!isEmpty(edit)}
                />
              }
              { !isEmpty(uidFields) && 
                <React.Fragment>
                  <Label htmlFor="uidField" message="UID field" />
                  <Select 
                    name="uidField"
                    options={uidFields}
                    onChange={({ target: { value } }) => setState((prevState) => ({ ...prevState, selectedUidField: value }))}
                    // disabled={!isEmpty(edit)}
                    value={state.selectedUidField}
                  />
                  <p style={{ color: '#9ea7b8', fontSize: 12, marginTop: 5, marginBottom: 20 }}>Select the preferred UID field to use for URLs.</p>
                </React.Fragment>
              }
            </div>
            <div className="col-md-6">
              <div className="row">
                {Object.keys(form).map(input => {
                  return (
                  <div className={form[input].styleName} key={input}>
                    <Inputs
                      name={input}
                      disabled={
                        state.contentType === '- Choose Content Type -'
                        || !state.contentType && isEmpty(edit)
                      }
                      {...form[input]}
                      onChange={(e) => onChange(e, contentType, settingsType)}
                      value={getValue(input)}
                    />
                  </div>
                )})}
                { settingsType === 'Collection' &&
                  <div className="col-12">
                    <InputUID
                      onChange={(e) => {
                        const { value } = e.target;
                        if (e.target.value.match(/^[A-Za-z0-9-_.~/]*$/)) {
                          setState(prevState => ({ ...prevState, area: value }));
                          onChange(e, contentType, settingsType);
                        }
                      }}
                      label={globalContext.formatMessage({ id: 'sitemap.Settings.Field.Area.Label' })}
                      description={globalContext.formatMessage({ id: 'sitemap.Settings.Field.Area.Description' })}
                      name="area"
                      value={!isEmpty(edit) ? getValue('area') : ''}
                      disabled={
                        state.contentType === '- Choose Content Type -'
                        || isEmpty(edit) && !isEmpty(uidFields) && isEmpty(state.selectedUidField) 
                        || !state.contentType && isEmpty(edit)
                      }
                    />
                  </div>
                }
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
            onClick={() => {
              onCancel();
              push({search: ''});
              setState(prevState => ({ ...prevState, contentType: '' }));
            }}
          >
            {globalContext.formatMessage({ id: 'sitemap.Button.Cancel' })}
          </Button>
          <Button
            color="primary"
            style={{ marginLeft: 'auto' }}
            disabled={
              state.contentType === '- Choose Content Type -'
              || !isEmpty(uidFields) && isEmpty(state.selectedUidField) 
              || !state.contentType && isEmpty(edit)
            }
            onClick={(e) => {
              onSubmit(e);
              setState(prevState => ({ ...prevState, contentType: '' }));
              push({search: ''});
            }}
          >
            {globalContext.formatMessage({ id: 'sitemap.Button.Save' })}
          </Button>
        </section>
      </ModalFooter>
    </Modal>
  );
}
 
export default ModalForm;