import React from 'react';

import { Inputs } from '@buffetjs/custom';
import { useIntl } from 'react-intl';

import form from '../mapper';
import InputUID from '../../inputUID';

const CustomForm = (props) => {
  const { formatMessage } = useIntl();

  const {
    onChange,
    onCancel,
    modifiedState,
    id,
    uid,
    setUid,
  } = props;

  const handleCustomChange = (e) => {
    let contentType = e.target.value;

    if (contentType.match(/^[A-Za-z0-9-_.~/]*$/)) {
      setUid(contentType);
    } else {
      contentType = uid;
    }

    // Set initial values
    onCancel(false);
    Object.keys(form).map((input) => {
      onChange(contentType, input, form[input].value);
    });
  };

  return (
    <div className="container-fluid">
      <section style={{ marginTop: 20 }}>
        <h2><strong>{formatMessage({ id: 'sitemap.Modal.Title' })}</strong></h2>
        {!id && (
          <p style={{ maxWidth: 500 }}>{formatMessage({ id: `sitemap.Modal.CustomDescription` })}</p>
        )}
        <form className="row" style={{ borderTop: '1px solid #f5f5f6', paddingTop: 30, marginTop: 10 }}>
          <div className="col-md-6">
            <InputUID
              onChange={(e) => handleCustomChange(e)}
              value={uid}
              label={formatMessage({ id: 'sitemap.Settings.Field.URL.Label' })}
              description={formatMessage({ id: 'sitemap.Settings.Field.URL.Description' })}
              name="url"
              disabled={id}
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
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CustomForm;
