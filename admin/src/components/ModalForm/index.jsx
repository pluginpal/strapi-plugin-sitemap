import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';

import { request } from '@strapi/helper-plugin';
import { ModalLayout, ModalFooter, ModalBody, ModalHeader, Button, Typography } from '@strapi/design-system';

import CustomForm from './Custom';
import CollectionForm from './Collection';

const ModalForm = (props) => {
  const [uid, setUid] = useState('');
  const [langcode, setLangcode] = useState('und');
  const [patternInvalid, setPatternInvalid] = useState({ invalid: false });
  const { formatMessage } = useIntl();

  const {
    onSubmit,
    onCancel,
    isOpen,
    id,
    lang,
    type,
    modifiedState,
    contentTypes,
  } = props;

  useEffect(() => {
    setPatternInvalid({ invalid: false });

    if (id && !uid) {
      setUid(id);
    } else {
      setUid('');
    }
    if (lang && langcode === 'und') {
      setLangcode(lang);
    } else {
      setLangcode('und');
    }

  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const submitForm = async (e) => {
    if (type === 'collection') {
      const response = await request('/sitemap/pattern/validate-pattern', {
        method: 'POST',
        body: {
          pattern: modifiedState.getIn([uid, 'languages', langcode, 'pattern'], null),
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
        return <CollectionForm uid={uid} setUid={setUid} langcode={langcode} setLangcode={setLangcode} setPatternInvalid={setPatternInvalid} patternInvalid={patternInvalid} {...props} />;
      case 'custom':
        return <CustomForm uid={uid} setUid={setUid} {...props} />;
      default:
        return null;
    }
  };

  return (
    <ModalLayout
      onClose={() => onCancel()}
      labelledBy="title"
    >
      <ModalHeader>
        <Typography textColor="neutral800" variant="omega" fontWeight="bold">
          {formatMessage({ id: 'sitemap.Modal.HeaderTitle', defaultMessage: 'Sitemap entries' })} - {type}
        </Typography>
      </ModalHeader>
      <ModalBody>
        {form()}
      </ModalBody>
      <ModalFooter
        startActions={(
          <Button onClick={() => onCancel()} variant="tertiary">
            {formatMessage({ id: 'sitemap.Button.Cancel', defaultMessage: 'Cancel' })}
          </Button>
        )}
        endActions={(
          <Button
            onClick={submitForm}
            disabled={!uid || (contentTypes && contentTypes[uid].locales && !langcode)}
          >
            {formatMessage({ id: 'sitemap.Button.Save', defaultMessage: 'Save' })}
          </Button>
        )}
      />
    </ModalLayout>
  );
};

export default ModalForm;
