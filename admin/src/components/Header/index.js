import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Map } from 'immutable';
import { useIntl } from 'react-intl';

import { useNotification } from '@strapi/helper-plugin';
import { HeaderLayout } from '@strapi/design-system/Layout';
import { Box } from '@strapi/design-system/Box';
import CheckIcon from '@strapi/icons/CheckIcon';
import { Button } from '@strapi/design-system/Button';

import { discardAllChanges, submit } from '../../state/actions/Sitemap';

const Header = () => {
  const settings = useSelector((state) => state.getIn(['sitemap', 'settings'], Map()));
  const initialData = useSelector((state) => state.getIn(['sitemap', 'initialData'], Map()));
  const toggleNotification = useNotification();

  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const disabled = JSON.stringify(settings) === JSON.stringify(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submit(settings.toJS(), toggleNotification));
  };

  const handleCancel = (e) => {
    e.preventDefault();
    dispatch(discardAllChanges());
  };

  return (
    <Box background="neutral100">
      <HeaderLayout
        primaryAction={(
          <Box style={{ display: "flex" }}>
            <Button
              onClick={handleCancel}
              disabled={disabled}
              type="cancel"
              size="L"
              variant="secondary"
            >
              {formatMessage({ id: 'sitemap.Button.Cancel' })}
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              onClick={handleSubmit}
              disabled={disabled}
              type="submit"
              startIcon={<CheckIcon />}
              size="L"
            >
              {formatMessage({ id: 'sitemap.Button.Save' })}
            </Button>
          </Box>
        )}
        title={formatMessage({ id: 'sitemap.Header.Title' })}
        subtitle={formatMessage({ id: 'sitemap.Header.Description' })}
        as="h2"
      />
    </Box>
  );
};

export default Header;
