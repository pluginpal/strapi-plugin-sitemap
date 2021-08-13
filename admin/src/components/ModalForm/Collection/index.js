import React, { useState } from 'react';

import { Inputs } from '@buffetjs/custom';
import { useGlobalContext, request } from 'strapi-helper-plugin';

import SelectContentTypes from '../../SelectContentTypes';
import HeaderModalNavContainer from '../../HeaderModalNavContainer';
import HeaderNavLink from '../../HeaderNavLink';

import form from '../mapper';
import InputUID from '../../inputUID';

const NAVLINKS = [{ id: 'base' }, { id: 'advanced' }];

const CollectionForm = (props) => {
  const [tab, setTab] = useState('base');
  const globalContext = useGlobalContext();

  const {
    contentTypes,
    onChange,
    onCancel,
    id,
    modifiedState,
    uid,
    setUid,
    patternInvalid,
    setPatternInvalid,
  } = props;

  const handleSelectChange = (e) => {
    const contentType = e.target.value;
    setUid(contentType);

    // Set initial values
    onCancel(false);
    Object.keys(form).map((input) => {
      onChange(contentType, input, form[input].value);
    });
  };

  return (
    <div className="container-fluid">
      <section style={{ marginTop: 20 }}>
        <div>
          <h2><strong>{globalContext.formatMessage({ id: 'sitemap.Modal.Title' })}</strong></h2>
          {!id && (
            <p style={{ maxWidth: 500 }}>{globalContext.formatMessage({ id: `sitemap.Modal.CollectionDescription` })}</p>
          )}
          <HeaderModalNavContainer>
            {NAVLINKS.map((link, index) => {
              return (
                <HeaderNavLink
                  // The advanced tab is disabled when adding an existing component
                  // step 1
                  isDisabled={false}
                  isActive={tab === link.id}
                  key={link.id}
                  {...link}
                  onClick={() => {
                    setTab(link.id);
                  }}
                  nextTab={index === NAVLINKS.length - 1 ? 0 : index + 1}
                />
              );
            })}
          </HeaderModalNavContainer>
        </div>
        <form className="row" style={{ borderTop: '1px solid #f5f5f6', paddingTop: 30, marginTop: 10 }}>
          <div className="col-md-6">
            <SelectContentTypes
              contentTypes={contentTypes}
              onChange={(e) => handleSelectChange(e)}
              value={uid}
              disabled={id}
              modifiedContentTypes={modifiedState}
            />
          </div>
          <div className="col-md-6">
            {tab === 'base' && (
              <InputUID
                onChange={async (e) => {
                  if (e.target.value.match(/^[A-Za-z0-9-_.~[\]/]*$/)) {
                    onChange(uid, 'pattern', e.target.value);
                    const valid = await request('/sitemap/pattern/validate-pattern', {
                      method: 'POST',
                      body: { pattern: e.target.value },
                    });

                    setPatternInvalid(!valid);
                  }
                }}
                invalid={patternInvalid}
                label={globalContext.formatMessage({ id: 'sitemap.Settings.Field.Pattern.Label' })}
                error={globalContext.formatMessage({ id: 'sitemap.Settings.Field.Pattern.Error' })}
                name="pattern"
                value={modifiedState.getIn([uid, 'pattern'], '')}
                disabled={!uid}
              />
            )}
            {tab === 'advanced' && (
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
            )}
          </div>
        </form>
      </section>
    </div>
  );
};

export default CollectionForm;
