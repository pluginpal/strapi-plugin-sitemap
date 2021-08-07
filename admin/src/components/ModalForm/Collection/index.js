import React from 'react';

import { Inputs } from '@buffetjs/custom';
import { useGlobalContext } from 'strapi-helper-plugin';
import SelectContentTypes from '../../SelectContentTypes';

import form from '../mapper';
import InputUID from '../../inputUID';

const CollectionForm = (props) => {
  const globalContext = useGlobalContext();

  const {
    contentTypes,
    onChange,
    onCancel,
    id,
    modifiedState,
    uid,
    setUid,
  } = props;

  const handleSelectChange = (e, uidFields) => {
    const contentType = e.target.value;

    // Set initial values
    onCancel(false);
    Object.keys(form).map((input) => {
      onChange(contentType, input, form[input].value);
    });

    if (uidFields[0]) {
      setUid(contentType);
      onChange(contentType, 'uidField', uidFields[0]);
      onChange(contentType, 'area', '');
    } else {
      setUid('');
    }
  };

  return (
    <div className="container-fluid">
      <section style={{ marginTop: 20 }}>
        <h2><strong>{globalContext.formatMessage({ id: 'sitemap.Modal.Title' })}</strong></h2>
        {!id && (
          <p style={{ maxWidth: 500 }}>{globalContext.formatMessage({ id: `sitemap.Modal.CollectionDescription` })}</p>
        )}
        <form className="row" style={{ borderTop: '1px solid #f5f5f6', paddingTop: 30, marginTop: 10 }}>
          <div className="col-md-6">
            <SelectContentTypes
              contentTypes={contentTypes}
              onChange={(e, uidFields) => handleSelectChange(e, uidFields)}
              value={uid}
              disabled={id}
              modifiedContentTypes={modifiedState}
            />
          </div>
          <div className="col-md-6">
            <div className="row">
              {Object.keys(form).map((input) => (
                <div className={form[input].styleName} key={input}>
                  <Inputs
                    name={input}
                    disabled={!uid}
                    {...form[input]}
                    onChange={(e) => onChange(uid, e.target.name, e.target.value)}
                    value={modifiedState.getIn([uid, input], form[input].value)}
                  />
                </div>
              ))}
              <div className="col-12">
                <InputUID
                  onChange={(e) => {
                    if (e.target.value.match(/^[A-Za-z0-9-_.~/]*$/)) {
                      onChange(uid, 'area', e.target.value);
                    }
                  }}
                  label={globalContext.formatMessage({ id: 'sitemap.Settings.Field.Area.Label' })}
                  description={globalContext.formatMessage({ id: 'sitemap.Settings.Field.Area.Description' })}
                  name="area"
                  value={modifiedState.getIn([uid, 'area'], '')}
                  disabled={!uid}
                />
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CollectionForm;
