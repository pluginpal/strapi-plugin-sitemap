import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Map } from 'immutable';
import { useIntl } from 'react-intl';

import { useNotification } from '@strapi/helper-plugin';
import { Box, Button, HeaderLayout } from '@strapi/design-system';
import { Check } from '@strapi/icons';

import { discardAllChanges, submit } from '../../state/actions/Sitemap';

const Header = ({getLocales}) => {
  const settings = useSelector((state) => state.getIn(['sitemap', 'settings'], Map()));
  const initialData = useSelector((state) => state.getIn(['sitemap', 'initialData'], Map()));
  const toggleNotification = useNotification();

  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const disabled = JSON.stringify(settings) === JSON.stringify(initialData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(submit(settings.toJS(), toggleNotification));
    getLocales();
  };

  const handleCancel = (e) => {
    e.preventDefault();
    dispatch(discardAllChanges());
  };

  return (
    <Box background="neutral100">
      <HeaderLayout
        primaryAction={(
          <Box style={{ display: 'flex' }}>
            <Button
              onClick={handleCancel}
              disabled={disabled}
              type="cancel"
              size="L"
              variant="secondary"
            >
              {formatMessage({ id: 'sitemap.Button.Cancel', defaultMessage: 'Cancel' })}
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              onClick={handleSubmit}
              disabled={disabled}
              type="submit"
              startIcon={<Check />}
              size="L"
            >
              {formatMessage({ id: 'sitemap.Button.Save', defaultMessage: 'Save' })}
            </Button>
          </Box>
        )}
        title={formatMessage({ id: 'sitemap.Header.Title', defaultMessage: 'Sitemap' })}
        subtitle={formatMessage({ id: 'sitemap.Header.Description', defaultMessage: 'Settings for the sitemap XML' })}
        as="h2"
      />
    </Box>
  );
};

export default Header;
