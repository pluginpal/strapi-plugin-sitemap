import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';

import { ModalLayout, ModalFooter, ModalBody, ModalHeader } from '@strapi/design-system/ModalLayout';
import { ButtonText } from '@strapi/design-system/Text';
import { Button } from '@strapi/design-system/Button';
import { TextInput } from '@strapi/design-system/TextInput';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { isEqual } from 'lodash/fp';

const ModalForm = (props) => {
  const { formatMessage } = useIntl();
  const {
    onCancel,
    isOpen,
    languages,
    onSave,
    hostnameOverrides,
  } = props;

  const [hostnames, setHostnames] = useState({});

  useEffect(() => {
    if (isOpen) {
      setHostnames({ ...hostnameOverrides });
    } else {
      setHostnames({});
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <ModalLayout
      onClose={() => onCancel()}
      labelledBy="title"
    >
      <ModalHeader>
        <ButtonText textColor="neutral800" as="h2" id="title">
          Hostname overrides
        </ButtonText>
      </ModalHeader>
      <ModalBody>
        <Grid gap={4}>
          {languages.map((language) => (
            <GridItem key={language.code} col={6} s={12}>
              <TextInput
                placeholder={`https://${language.code}.strapi.io`}
                label={`${language.name} hostname`}
                name="hostname"
                value={hostnames[language.code]}
                hint={`Set a hostname for URLs of the "${language.code}" locale`}
                onChange={(e) => {
                  if (!e.target.value) {
                    delete hostnames[language.code];
                  } else {
                    hostnames[language.code] = e.target.value;
                  }

                  setHostnames({ ...hostnames });
                }}
              />
            </GridItem>
          ))}
        </Grid>
      </ModalBody>
      <ModalFooter
        startActions={(
          <Button onClick={() => onCancel()} variant="tertiary">
            {formatMessage({ id: 'sitemap.Button.Cancel' })}
          </Button>
        )}
        endActions={(
          <Button
            onClick={() => onSave(hostnames)}
            disabled={isEqual(hostnames, hostnameOverrides)}
          >
            {formatMessage({ id: 'sitemap.Button.Save' })}
          </Button>
        )}
      />
    </ModalLayout>
  );
};

export default ModalForm;
